import Link from 'next/link'

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  // Attempt to retrieve Stripe session info server-side
  let email: string | null = null
  let amount: number | null = null

  if (sessionId) {
    try {
      // Dynamic import to avoid build errors if STRIPE_SECRET_KEY not set
      const { stripe } = await import('@/lib/stripe')
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      email = session.customer_details?.email ?? session.customer_email
      amount = session.amount_total ? session.amount_total / 100 : null
    } catch {
      // Silently fail — show generic success
    }
  }

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 10vw',
        background: 'var(--black-deep)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        {/* Decorative symbol */}
        <div
          style={{
            fontSize: 48,
            color: 'var(--gold)',
            marginBottom: 32,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          &#10022;
        </div>

        <p
          style={{
            fontSize: 8,
            letterSpacing: 6,
            color: 'rgba(205,133,63,0.5)',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Pedido confirmado
        </p>

        <h1
          className="font-light"
          style={{
            fontSize: 'clamp(28px,4vw,52px)',
            color: '#fff',
            letterSpacing: 2,
            marginBottom: 24,
            fontFamily: 'var(--font-serif)',
          }}
        >
          Gracias por tu compra
        </h1>

        {email && (
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
            Confirmacion enviada a{' '}
            <strong style={{ color: 'var(--gold-light)', fontWeight: 400 }}>{email}</strong>
          </p>
        )}

        {amount !== null && (
          <p style={{ fontSize: 16, color: 'var(--gold-light)', marginBottom: 12, fontWeight: 300 }}>
            Total: &#8364; {amount.toFixed(2)}
          </p>
        )}

        <p
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 48,
            lineHeight: 1.8,
            maxWidth: 380,
            margin: '0 auto 48px',
          }}
        >
          Tu fragancia esta siendo preparada con los maximos cuidados. Recibiras un email con el seguimiento del envio en breve.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/coleccion"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              background: 'var(--gold)',
              color: '#000',
              fontSize: 9,
              letterSpacing: 5,
              textTransform: 'uppercase',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Seguir Explorando
          </Link>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              border: '1px solid rgba(205,133,63,0.25)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 9,
              letterSpacing: 5,
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
