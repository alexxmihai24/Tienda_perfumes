'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, count } = useCart()
  const drawerRef = useRef<HTMLElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Remember the trigger so we can restore focus when the drawer closes.
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    closeBtnRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const nodes = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      restoreFocusRef.current?.focus?.()
    }
  }, [isOpen, setIsOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 60,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(4px)',
            }}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Carrito de compra"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              zIndex: 61,
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 400,
              background: 'var(--black-card)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '24px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: 5,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                }}
              >
                Carrito · {count}
              </span>
              <button
                ref={closeBtnRef}
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar carrito"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  lineHeight: 1,
                  padding: '4px 8px',
                  transition: 'color 0.2s',
                }}
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 60 }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      marginTop: 24,
                      fontSize: 9,
                      letterSpacing: 4,
                      color: 'var(--gold)',
                      textTransform: 'uppercase',
                      background: 'none',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      padding: '12px 24px',
                    }}
                  >
                    Explorar Colección
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    style={{
                      display: 'flex',
                      gap: 16,
                      paddingBottom: 16,
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: 'relative',
                        width: 64,
                        height: 80,
                        flexShrink: 0,
                        background: 'rgba(154,164,180,0.05)',
                        overflow: 'hidden',
                      }}
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                          style={{ mixBlendMode: 'luminosity' }}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 13,
                          color: '#fff',
                          letterSpacing: 1,
                          fontWeight: 300,
                          marginBottom: 4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--gold-light)', marginBottom: 10 }}>
                        € {item.price.toFixed(2)}
                      </p>

                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQty(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          aria-label="Reducir cantidad"
                          style={{
                            width: 26,
                            height: 26,
                            border: '1px solid var(--border)',
                            color: '#fff',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          −
                        </button>
                        <span style={{ fontSize: 12, color: '#fff', minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                          style={{
                            width: 26,
                            height: 26,
                            border: '1px solid var(--border)',
                            color: '#fff',
                            background: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 18,
                        alignSelf: 'flex-start',
                        transition: 'color 0.2s',
                        padding: '4px',
                      }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: 24, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                    Subtotal
                  </span>
                  <span style={{ fontSize: 16, color: 'var(--gold-light)', letterSpacing: 1, fontWeight: 300 }}>
                    € {total.toFixed(2)}
                  </span>
                </div>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginBottom: 20, letterSpacing: 1 }}>
                  Envío calculado al finalizar
                </p>
                <Link
                  href="/carrito"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '14px',
                    background: 'var(--gold)',
                    color: '#000',
                    fontSize: 9,
                    letterSpacing: 4,
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Ir al Checkout →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
