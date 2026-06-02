import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCarousel } from '@/components/ui/ProductCarousel'
import { Hero } from '@/components/ui/Hero'
import { StorySection } from '@/components/ui/StorySection'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { Reveal } from '@/components/ui/Reveal'
import { serializeProducts } from '@/lib/serialize'

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
  const featured = serializeProducts(
    await prisma.product.findMany({
      where: { active: true },
      take: 8,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
  )

  return (
    <main>
      {/* Hero — product cover (public/hero.png) */}
      <Hero />

      {/* Signature stories — editorial scroll reveals */}
      <StorySection />

      {/* Marquee */}
      <MarqueeStrip items={MARQUEE_NOTES} />

      {/* Featured Products — carrusel interactivo */}
      <section id="destacados" style={{ padding: '110px 0', background: 'var(--night)', overflow: 'hidden' }}>
        <Reveal>
          <div style={{ marginBottom: 56, padding: '0 10vw', textAlign: 'center' }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: 5,
                color: 'var(--silver)',
                textTransform: 'uppercase',
                marginBottom: 14,
              }}
            >
              Destacados
            </p>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(30px,4.5vw,60px)',
                letterSpacing: -0.5,
                color: 'var(--ice)',
                fontWeight: 300,
                lineHeight: 1.05,
                marginBottom: 20,
              }}
            >
              Esencias de temporada
            </h2>
            <div style={{ width: 40, height: 1, background: 'var(--silver)', opacity: 0.4, margin: '0 auto' }} />
          </div>
        </Reveal>

        <Reveal y={36} delay={0.05}>
          <div style={{ padding: '0 6vw' }}>
            <ProductCarousel products={featured} />
          </div>
        </Reveal>

        <div style={{ marginTop: 56, textAlign: 'center' }}>
          <Link
            href="/coleccion"
            style={{
              display: 'inline-block',
              padding: '14px 40px',
              border: '1px solid var(--border)',
              color: 'var(--ice)',
              fontSize: 11,
              letterSpacing: 4,
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
      <Reveal>
        <section
          style={{
            padding: '90px 10vw',
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: 5, color: 'var(--silver)', textTransform: 'uppercase', marginBottom: 16 }}>
            Acceso Exclusivo
          </p>
          <h2 className="font-serif" style={{ fontSize: 'clamp(26px,3.4vw,44px)', letterSpacing: -0.3, color: 'var(--ice)', fontWeight: 300, marginBottom: 16 }}>
            Descubre los lanzamientos<br />antes que nadie
          </h2>
          <p style={{ fontSize: 13, color: 'var(--ice-dim)', marginBottom: 40, lineHeight: 1.7 }}>
            Suscribete y recibe acceso anticipado, ediciones limitadas y composiciones ineditas.
          </p>
          <NewsletterForm />
        </section>
      </Reveal>
    </main>
  )
}
