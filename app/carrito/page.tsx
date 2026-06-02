'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { items, removeItem, updateQty, total, count, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
          customerEmail: 'cliente@ejemplo.com',
          customerName: 'Cliente Azahara',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al procesar el pago')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ paddingTop: 100, background: 'var(--black-deep)', minHeight: '100svh' }}>
      <div style={{ padding: '40px 10vw 96px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 className="font-light" style={{ fontSize: 'clamp(28px,4vw,52px)', letterSpacing: 2, color: '#fff', marginBottom: 48, fontFamily: 'var(--font-serif)' }}>
          Tu Carrito
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
              Tu carrito esta vacio.
            </p>
            <Link href="/coleccion" style={{ display: 'inline-block', padding: '14px 36px', border: '1px solid rgba(154,164,180,0.3)', color: 'var(--gold)', fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', textDecoration: 'none' }}>
              Explorar Coleccion
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'start' }}>
            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', gap: 24, padding: '28px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', width: 72, height: 96, flexShrink: 0, background: 'rgba(154,164,180,0.04)' }}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-contain" style={{ mixBlendMode: 'luminosity' }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: '#fff', letterSpacing: 1, fontWeight: 300, marginBottom: 6 }}>{item.name}</p>
                    <p style={{ fontSize: 13, color: 'var(--gold-light)', marginBottom: 16 }}>&#8364; {item.price.toFixed(2)}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeItem(item.id)} aria-label="Reducir" style={{ width: 30, height: 30, border: '1px solid var(--border)', color: '#fff', background: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#8722;</button>
                      <span style={{ fontSize: 13, color: '#fff', minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} aria-label="Aumentar" style={{ width: 30, height: 30, border: '1px solid var(--border)', color: '#fff', background: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                    </div>
                  </div>

                  {/* Subtotal + remove */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, color: 'var(--gold-light)', marginBottom: 12, fontWeight: 300 }}>
                      &#8364; {(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button onClick={() => removeItem(item.id)} aria-label={`Eliminar ${item.name}`} style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', transition: 'color 0.2s' }}>
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <div style={{ minWidth: 280, padding: 28, border: '1px solid var(--border)', background: 'var(--black-card)', position: 'sticky', top: 100 }}>
              <p style={{ fontSize: 9, letterSpacing: 5, color: 'rgba(154,164,180,0.45)', textTransform: 'uppercase', marginBottom: 24 }}>
                Resumen del pedido
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Subtotal ({count} art.)</span>
                <span style={{ fontSize: 12, color: '#fff' }}>&#8364; {total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Envio</span>
                <span style={{ fontSize: 12, color: total > 100 ? 'rgba(74,222,128,0.7)' : '#fff' }}>
                  {total > 100 ? 'Gratuito' : '€ 6.95'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)', marginBottom: 24 }}>
                <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Total</span>
                <span style={{ fontSize: 20, color: 'var(--gold-light)', fontWeight: 300 }}>
                  &#8364; {(total > 100 ? total : total + 6.95).toFixed(2)}
                </span>
              </div>

              {error && (
                <p style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', marginBottom: 12, letterSpacing: 1 }}>{error}</p>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? 'rgba(154,164,180,0.4)' : 'var(--gold)',
                  color: '#000',
                  fontSize: 9,
                  letterSpacing: 5,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {loading ? 'Procesando...' : 'Ir al Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
