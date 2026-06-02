'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ProductCardProduct {
  id: string
  name: string
  slug: string
  price: number | { toString(): string }
  images: string[]
  notesHeart: string[]
  collection?: string | null
  featured?: boolean
  active?: boolean
}

export function ProductCard({ product }: { product: ProductCardProduct }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{ background: 'var(--surface)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      <Link
        href={`/producto/${product.slug}`}
        style={{ textDecoration: 'none', display: 'block', position: 'relative', zIndex: 1 }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '4 / 5',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, var(--surface-2), var(--ink))',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'radial-gradient(80% 55% at 50% 115%, var(--glow), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 30vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '26px 28px 30px' }}>
          {product.collection && (
            <p style={{ fontSize: 10, letterSpacing: 4, color: 'var(--silver)', textTransform: 'uppercase', marginBottom: 10 }}>
              {product.collection}
            </p>
          )}
          <h3
            className="font-serif"
            style={{ fontSize: 22, letterSpacing: 0.5, color: 'var(--ice)', marginBottom: 8, fontWeight: 300 }}
          >
            {product.name}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--ice-dim)', marginBottom: 22, lineHeight: 1.6 }}>
            {product.notesHeart.slice(0, 2).join(' · ')}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, color: 'var(--ice)', letterSpacing: 1, fontWeight: 300 }}>
              € {Number(product.price).toFixed(2)}
            </span>
            <span style={{ fontSize: 10, color: 'var(--silver)', letterSpacing: 3, textTransform: 'uppercase' }}>
              Ver →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
