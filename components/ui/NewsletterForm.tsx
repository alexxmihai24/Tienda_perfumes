'use client'

/**
 * Formulario de newsletter (client boundary — usa onSubmit).
 * `compact` = variante del footer (más pequeña, botón con flecha).
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <form onSubmit={e => e.preventDefault()} style={{ display: 'flex' }} aria-label="Suscripcion newsletter">
        <input
          type="email"
          placeholder="tu@email.com"
          aria-label="Email newsletter"
          style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', borderRight: 'none', padding: '10px 14px', color: '#fff', fontSize: 11, outline: 'none' }}
        />
        <button type="submit" aria-label="Suscribirse" style={{ padding: '10px 16px', background: 'var(--gold)', color: '#000', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          &#8594;
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={e => e.preventDefault()}
      style={{ display: 'flex', maxWidth: 420, margin: '0 auto' }}
      aria-label="Suscripcion newsletter"
    >
      <input
        type="email"
        placeholder="tu@email.com"
        aria-label="Email"
        style={{
          flex: 1,
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRight: 'none',
          padding: '14px 20px',
          color: '#fff',
          fontSize: 11,
          outline: 'none',
        }}
      />
      <button
        type="submit"
        style={{
          padding: '14px 24px',
          background: 'var(--gold)',
          color: '#000',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Suscribirse
      </button>
    </form>
  )
}
