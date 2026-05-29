'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: fd.get('email'),
      password: fd.get('password'),
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Credenciales incorrectas. Verifica tu email y contrasena.')
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--black-deep)',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: 7, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>
            Azahara
          </p>
          <p style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            Panel de Administracion
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            padding: '36px',
            border: '1px solid var(--border)',
            background: 'var(--black-card)',
          }}
          aria-label="Formulario de acceso admin"
        >
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: 8, letterSpacing: 4, color: 'rgba(205,133,63,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@azahara.com"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: '12px 16px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', fontSize: 8, letterSpacing: 4, color: 'rgba(205,133,63,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: '12px 16px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p role="alert" style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', letterSpacing: 0.5 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: '14px',
              background: loading ? 'rgba(205,133,63,0.4)' : 'var(--gold)',
              color: '#000',
              fontSize: 9,
              letterSpacing: 5,
              textTransform: 'uppercase',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.3s',
            }}
          >
            {loading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </main>
  )
}
