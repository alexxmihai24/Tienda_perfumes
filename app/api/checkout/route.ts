import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { checkoutSchema } from '@/lib/validations'
import { checkoutLimiter } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  // Rate limiting
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    '127.0.0.1'

  const { success } = await checkoutLimiter.limit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  // Parse + validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { items } = parsed.data

  // Load products from DB (only active)
  const productIds = items.map((i) => i.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  })

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: 'One or more products not found or inactive' },
      { status: 404 }
    )
  }

  // Verify stock for each item
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!
    if (product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        },
        { status: 409 }
      )
    }
  }

  // Resolve site URL for Stripe redirect targets — fail closed if unset.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) {
    console.error('[checkout] NEXT_PUBLIC_SITE_URL is not configured')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // Build Stripe line_items — price in cents (Decimal -> number -> integer)
  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!
    const priceInCents = Math.round(Number(product.price) * 100)
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
          images: product.images.slice(0, 1),
          metadata: { productId: product.id, slug: product.slug },
        },
        unit_amount: priceInCents,
      },
      quantity: item.quantity,
    }
  })

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${siteUrl}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/carrito`,
    billing_address_collection: 'required',
    metadata: {
      items: JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity }))),
    },
  })

  return NextResponse.json({ url: session.url })
}
