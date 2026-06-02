import Image from 'next/image'
import Link from 'next/link'
import { Reveal } from './Reveal'

interface Story {
  label: string
  slug: string
  image: string
  heading: string
  body: string
}

const stories: Story[] = [
  {
    label: 'Ambre Noir',
    slug: 'ambre-noir',
    image: '/products/ambre-noir.jpg',
    heading: 'El arte del oud profundo',
    body: 'Oud de Laos, ámbar gris y sándalo de Mysore. Una composición que evoluciona sobre la piel durante más de doce horas.',
  },
  {
    label: 'Santal Mystique',
    slug: 'santal-mystique',
    image: '/products/santal-mystique.jpg',
    heading: 'Calidez envolvente',
    body: 'Sándalo de Mysore, cedro del Atlas y vainilla Bourbon. Sensorial y envolvente, permanece hasta el amanecer.',
  },
  {
    label: 'Oud Imperial',
    slug: 'oud-imperial',
    image: '/products/oud-imperial.jpg',
    heading: 'La firma de los ateliers',
    body: 'Oud de primera extracción, rosa de Taif y nagarmotha. La composición más preciada de la casa.',
  },
]

export function StorySection() {
  return (
    <section style={{ padding: '120px 0 100px', background: 'var(--ink)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 8vw, 120px)' }}>
        <Reveal>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 5,
              color: 'var(--silver)',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            El alma de la casa
          </p>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(30px, 4.5vw, 60px)',
              color: 'var(--ice)',
              fontWeight: 300,
              letterSpacing: -0.5,
              lineHeight: 1.05,
              maxWidth: 720,
              marginBottom: 90,
            }}
          >
            Tres composiciones que definen{' '}
            <span className="chrome-text" style={{ fontStyle: 'italic' }}>
              nuestra firma
            </span>
          </h2>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(72px, 9vw, 130px)' }}>
          {stories.map((story, i) => {
            const reversed = i % 2 === 1
            return (
              <div
                key={story.slug}
                className="story-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'clamp(32px, 6vw, 88px)',
                  alignItems: 'center',
                  direction: reversed ? 'rtl' : 'ltr',
                }}
              >
                {/* Image */}
                <Reveal y={36} style={{ direction: 'ltr' }}>
                  <Link
                    href={`/producto/${story.slug}`}
                    className="story-image"
                    style={{
                      display: 'block',
                      position: 'relative',
                      aspectRatio: '4 / 5',
                      borderRadius: 14,
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        background:
                          'radial-gradient(80% 60% at 50% 110%, var(--glow), transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <Image
                      src={story.image}
                      alt={story.label}
                      fill
                      sizes="(max-width: 860px) 92vw, 44vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Link>
                </Reveal>

                {/* Text */}
                <Reveal y={24} delay={0.1} style={{ direction: 'ltr' }}>
                  <p
                    style={{
                      fontSize: 11,
                      letterSpacing: 4,
                      color: 'var(--silver)',
                      textTransform: 'uppercase',
                      marginBottom: 18,
                    }}
                  >
                    {story.label}
                  </p>
                  <h3
                    className="font-serif"
                    style={{
                      fontSize: 'clamp(26px, 3.4vw, 44px)',
                      color: 'var(--ice)',
                      fontWeight: 300,
                      lineHeight: 1.12,
                      letterSpacing: -0.3,
                      marginBottom: 22,
                    }}
                  >
                    {story.heading}
                  </h3>
                  <div style={{ width: 40, height: 1, background: 'var(--silver)', opacity: 0.45, marginBottom: 22 }} />
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--ice-dim)',
                      lineHeight: 1.9,
                      maxWidth: 420,
                      marginBottom: 28,
                    }}
                  >
                    {story.body}
                  </p>
                  <Link
                    href={`/producto/${story.slug}`}
                    style={{
                      fontSize: 11,
                      letterSpacing: 3,
                      color: 'var(--ice)',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      borderBottom: '1px solid var(--silver)',
                      paddingBottom: 4,
                    }}
                  >
                    Descubrir →
                  </Link>
                </Reveal>
              </div>
            )
          })}
        </div>
      </div>

      {/* Responsive: stack rows on narrow viewports */}
      <style>{`
        @media (max-width: 860px) {
          .story-row { grid-template-columns: 1fr !important; direction: ltr !important; }
        }
      `}</style>
    </section>
  )
}
