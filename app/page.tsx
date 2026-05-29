import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/ProductCard'
import { HeroClient } from '@/components/ui/HeroClient'
import { ScrollStoryClient } from '@/components/ui/ScrollStoryClient'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'

export const revalidate = 60

const MARQUEE_NOTES = [
  'Oud de Laos',
  'Ambar Gris',
  'Sandalo de Mysore',
  'Rosa de Taif',
  'Benjui de Siam',
  'Nagarmotha',
  'Neroli de Sevilla',
  'Vetiver de Haiti',
  'Iris Palida',
  'Incienso Etiopico',
]

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true, active: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main>
      {/* Hero — client boundary for 3D + Framer Motion */}
      <HeroClient />

      {/* Scroll Story — client boundary */}
      <ScrollStoryClient />

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_NOTES} />

      {/* Featured Products */}
      <section style={{ padding: '96px 10vw', background: 'var(--black-deep)' }}>
        <div style={{ marginBottom: 64 }}>
          <p
            style={{
              fontSize: 8,
              letterSpacing: 6,
              color: 'rgba(205,133,63,0.4)',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            Destacados
          </p>
          <h2
            className="font-light"
            style={{ fontSize: 'clamp(28px,4vw,56px)', letterSpacing: 2, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}
          >
            Esencias de<br />temporada
          </h2>
          <div style={{ width: 36, height: 1, background: 'rgba(205,133,63,0.35)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            background: 'var(--border)',
          }}
        >
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <Link
            href="/coleccion"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              border: '1px solid rgba(205,133,63,0.3)',
              color: 'var(--gold)',
              fontSize: 9,
              letterSpacing: 5,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.3s',
            }}
          >
            Ver Coleccion Completa
          </Link>
        </div>
      </section>

      {/* Newsletter Strip */}
      <section
        style={{
          padding: '80px 10vw',
          background: 'var(--black-card)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 8, letterSpacing: 6, color: 'rgba(205,133,63,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
          Acceso Exclusivo
        </p>
        <h2 className="font-light" style={{ fontSize: 'clamp(24px,3vw,40px)', letterSpacing: 2, color: '#fff', marginBottom: 16 }}>
          Descubre los lanzamientos<br />antes que nadie
        </h2>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 40, lineHeight: 1.7 }}>
          Suscribete y recibe acceso anticipado, ediciones limitadas y composiciones ineditas.
        </p>
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
      </section>
    </main>
  )
}
