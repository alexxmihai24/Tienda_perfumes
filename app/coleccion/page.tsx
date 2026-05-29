import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/ProductCard'
import { CollectionFilters } from '@/components/ui/CollectionFilters'

export const revalidate = 60

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; sort?: string }>
}) {
  const params = await searchParams
  const collection = params.collection
  const sort = params.sort

  const orderBy =
    sort === 'price-asc'
      ? { price: 'asc' as const }
      : sort === 'price-desc'
      ? { price: 'desc' as const }
      : { createdAt: 'desc' as const }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(collection ? { collection } : {}),
    },
    orderBy,
  })

  // Unique collections for filter
  const allProducts = await prisma.product.findMany({
    where: { active: true },
    select: { collection: true },
  })
  const collections = Array.from(
    new Set(allProducts.map(p => p.collection).filter(Boolean))
  ) as string[]

  return (
    <main style={{ paddingTop: 100, background: 'var(--black-deep)', minHeight: '100svh' }}>
      {/* Header */}
      <section style={{ padding: '40px 10vw 48px' }}>
        <p
          style={{
            fontSize: 8,
            letterSpacing: 6,
            color: 'rgba(205,133,63,0.4)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          Todas las fragancias
        </p>
        <h1
          className="font-light"
          style={{
            fontSize: 'clamp(36px,5vw,72px)',
            letterSpacing: 2,
            color: '#fff',
            marginBottom: 20,
            fontFamily: 'var(--font-serif)',
          }}
        >
          Coleccion
        </h1>
        <div style={{ width: 36, height: 1, background: 'rgba(205,133,63,0.35)', marginBottom: 40 }} />

        {/* Filters — client */}
        <CollectionFilters
          collections={collections}
          activeCollection={collection}
          activeSort={sort}
        />
      </section>

      {/* Grid */}
      <section style={{ padding: '0 10vw 96px' }}>
        {products.length === 0 ? (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '80px 0' }}>
            No hay productos en esta coleccion.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1,
              background: 'var(--border)',
            }}
          >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
