'use client'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'

interface ProductInfo {
  id: string
  name: string
  slug: string
  price: number
  image: string
  stock: number
}

export function AddToCartSection({ product }: { product: ProductInfo }) {
  const { addItem, setIsOpen } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const inStock = product.stock > 0

  function handleAdd() {
    if (!inStock) return
    addItem({ id: product.id, name: product.name, slug: product.slug, price: product.price, image: product.image, quantity: qty })
    setAdded(true)
    timeoutRef.current = setTimeout(() => {
      setAdded(false)
      setIsOpen(true)
    }, 800)
  }

  return (
    <div>
      {/* Quantity selector */}
      {inStock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Cantidad</span>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              aria-label="Reducir cantidad"
              style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              &#8722;
            </button>
            <span style={{ minWidth: 32, textAlign: 'center', fontSize: 13, color: '#fff' }}>{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(10, q + 1))}
              aria-label="Aumentar cantidad"
              style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        disabled={!inStock}
        aria-label={inStock ? 'Anadir al carrito' : 'Producto agotado'}
        style={{
          width: '100%',
          padding: '16px',
          background: inStock ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
          color: inStock ? '#000' : 'rgba(255,255,255,0.25)',
          fontSize: 9,
          letterSpacing: 5,
          textTransform: 'uppercase',
          fontWeight: 600,
          border: 'none',
          cursor: inStock ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s',
        }}
      >
        {added ? '✓ Anadido' : inStock ? 'Anadir al Carrito' : 'Agotado'}
      </motion.button>
    </div>
  )
}
