import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { AddToCartSection } from '@/components/ui/AddToCartSection'
import { ProductCard } from '@/components/ui/ProductCard'
import { serializeProducts } from '@/lib/serialize'

export const revalidate = 60

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true },
    })
    return products.map(p => ({ slug: p.slug }))
  } catch {
    // DB unavailable at build time — fall back to on-demand rendering.
    return []
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
  })
  if (!product) notFound()

  // Related products (same collection, exclude this one)
  const related = serializeProducts(
    await prisma.product.findMany({
      where: {
        active: true,
        collection: product.collection ?? undefined,
        NOT: { id: product.id },
      },
      take: 3,
    })
  )

  const notesPyramid: [string, string[]][] = [
    ['Salida', product.notesTop],
    ['Corazon', product.notesHeart],
    ['Fondo', product.notesBase],
  ]

  return (
    <main style={{ paddingTop: 100, background: 'var(--black-deep)', minHeight: '100svh' }}>
      {/* Split layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          padding: '40px 8vw 80px',
          alignItems: 'start',
        }}
      >
        {/* Left — product photo */}
        <div style={{ position: 'sticky', top: 100 }}>
          {product.images[0] && (
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                borderRadius: 14,
                border: '1px solid var(--border)',
                background: 'linear-gradient(180deg, var(--surface-2), var(--ink))',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                  background: 'radial-gradient(80% 60% at 50% 115%, var(--glow), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 92vw, 44vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>

        {/* Right — info */}
        <div style={{ paddingTop: 32 }}>
          {product.collection && (
            <p
              style={{
                fontSize: 8,
                letterSpacing: 5,
                color: 'var(--silver)',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}
            >
              {product.collection}
            </p>
          )}

          <h1
            className="font-light"
            style={{
              fontSize: 'clamp(28px,3.5vw,52px)',
              letterSpacing: 2,
              color: '#fff',
              marginBottom: 16,
              lineHeight: 1.1,
              fontFamily: 'var(--font-serif)',
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.85,
              marginBottom: 36,
            }}
          >
            {product.description}
          </p>

          {/* Olfactory pyramid */}
          <div
            style={{
              marginBottom: 36,
              padding: '24px',
              border: '1px solid var(--border)',
              background: 'rgba(154,164,180,0.03)',
            }}
          >
            <p
              style={{
                fontSize: 8,
                letterSpacing: 5,
                color: 'var(--silver)',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Piramide Olfativa
            </p>
            {notesPyramid.map(([label, notes]) => (
              <div key={label} style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontSize: 8,
                    letterSpacing: 3,
                    color: 'var(--silver)',
                    textTransform: 'uppercase',
                    minWidth: 64,
                    paddingTop: 2,
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                  {notes.join(' · ')}
                </span>
              </div>
            ))}
          </div>

          {/* Price + stock */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <p style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(154,164,180,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>
                Precio
              </p>
              <p style={{ fontSize: 30, color: 'var(--gold-light)', letterSpacing: 1, fontWeight: 300 }}>
                &#8364; {Number(product.price).toFixed(2)}
              </p>
            </div>
            <p
              style={{
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                color: product.stock > 0 ? 'rgba(74,222,128,0.65)' : 'rgba(248,113,113,0.65)',
              }}
            >
              {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
            </p>
          </div>

          {/* Add to cart — client */}
          <AddToCartSection product={{ id: product.id, name: product.name, slug: product.slug, price: Number(product.price), image: product.images[0] || '', stock: product.stock }} />

          {/* Accordion */}
          <div style={{ marginTop: 32, borderTop: '1px solid var(--border)' }}>
            {[
              ['Descripcion detallada', product.description],
              ['Envio y devoluciones', 'Envio gratuito en pedidos superiores a 100 EUR. Devoluciones aceptadas en 14 dias en envase precintado.'],
              ['Notas sobre los ingredientes', [...product.notesTop, ...product.notesHeart, ...product.notesBase].join(', ')],
            ].map(([title, content]) => (
              <details
                key={title}
                style={{
                  borderBottom: '1px solid var(--border)',
                  padding: '16px 0',
                }}
              >
                <summary
                  style={{
                    fontSize: 9,
                    letterSpacing: 3,
                    color: 'rgba(255,255,255,0.7)',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {title}
                  <span style={{ color: 'rgba(154,164,180,0.4)', fontSize: 14 }}>+</span>
                </summary>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginTop: 12 }}>
                  {content}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ padding: '0 8vw 96px' }}>
          <div style={{ marginBottom: 40, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(154,164,180,0.4)', textTransform: 'uppercase', marginBottom: 12 }}>
              Tambien te puede gustar
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)' }}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
