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
      style={{ background: 'var(--black-deep)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      {/* Hover glow */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(205,133,63,0.08), transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Link
        href={`/producto/${product.slug}`}
        style={{ textDecoration: 'none', display: 'block', padding: '48px 36px', position: 'relative', zIndex: 1 }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            height: 220,
            marginBottom: 32,
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 100%, rgba(205,133,63,0.05), transparent)',
          }}
        >
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-700 hover:scale-105"
              style={{ mixBlendMode: 'luminosity', filter: 'sepia(0.15) saturate(0.9)' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              left: '15%',
              right: '15%',
              height: 40,
              borderRadius: '50%',
              background: 'rgba(205,133,63,0.06)',
              filter: 'blur(20px)',
            }}
          />
        </div>

        {/* Info */}
        {product.collection && (
          <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(205,133,63,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
            {product.collection}
          </p>
        )}
        <h3 className="font-light" style={{ fontSize: 18, letterSpacing: 2, color: '#ffffff', marginBottom: 8 }}>
          {product.name}
        </h3>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.6 }}>
          {product.notesHeart.slice(0, 2).join(' · ')}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, color: 'var(--gold-light)', letterSpacing: 1, fontWeight: 300 }}>
            € {Number(product.price).toFixed(2)}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(205,133,63,0.5)', letterSpacing: 3, textTransform: 'uppercase' }}>
            Ver →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
