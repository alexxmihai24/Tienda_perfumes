import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

// Required: disable body parsing so we receive the raw buffer for signature verification
export const config = {
  api: { bodyParser: false },
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET not configured' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Idempotency: Stripe retries deliveries, so ignore an event already recorded.
    const existing = await prisma.order.findUnique({ where: { stripeId: session.id } })
    if (existing) {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
    }

    // Parse items from session metadata
    let cartItems: Array<{ productId: string; quantity: number }> = []
    try {
      cartItems = session.metadata?.items
        ? JSON.parse(session.metadata.items)
        : []
    } catch {
      return NextResponse.json({ error: 'Failed to parse session metadata' }, { status: 400 })
    }

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'No items in session metadata' }, { status: 400 })
    }

    // Load products for price verification
    const productIds = cartItems.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    // The customer already paid — never silently drop items. Log any product
    // that no longer exists so it surfaces for manual reconciliation.
    if (products.length !== productIds.length) {
      const missing = productIds.filter((id) => !products.some((p) => p.id === id))
      console.error(
        `[webhook] Session ${session.id}: products not found, recorded without them: ${missing.join(', ')}`
      )
    }

    // Compute total from DB prices (source of truth, not Stripe amounts)
    const total = cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      if (!product) return sum
      return sum + Number(product.price) * item.quantity
    }, 0)

    const customerEmail =
      session.customer_details?.email ??
      session.customer_email ??
      'unknown@azahara.com'

    const customerName =
      session.customer_details?.name ?? 'Cliente Azahara'

    // Atomic transaction: create Order + OrderItems + decrement stock
    try {
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            stripeId: session.id,
            customerEmail,
            customerName,
            total,
            status: 'PAID',
          },
        })

        for (const item of cartItems) {
          const product = products.find((p) => p.id === item.productId)
          if (!product) continue

          await tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              price: Number(product.price),
            },
          })

          // Guarded decrement: only succeeds while enough stock remains, so
          // concurrent orders can never drive stock negative.
          const updated = await tx.product.updateMany({
            where: { id: item.productId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          })
          if (updated.count === 0) {
            console.error(
              `[webhook] Oversell on ${item.productId} (session ${session.id}); clamping stock to 0.`
            )
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: 0 },
            })
          }
        }
      })
    } catch (err) {
      // A concurrent retry may have won the race on the unique stripeId.
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        (err as { code?: string }).code === 'P2002'
      ) {
        return NextResponse.json({ received: true, duplicate: true }, { status: 200 })
      }
      console.error('[webhook] Failed to record order', err)
      return NextResponse.json({ error: 'Failed to record order' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
