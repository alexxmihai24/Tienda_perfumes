'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const LINKS: [string, string][] = [
  ['Inicio', '/'],
  ['Colección', '/coleccion'],
]

export function Navbar() {
  const { count, setIsOpen } = useCart()
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85])
  const borderAlpha = useTransform(scrollY, [0, 80], [0, 0.14])
  const border = useTransform(borderAlpha, a => `1px solid rgba(154,164,180,${a})`)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px clamp(20px, 10vw, 200px)',
      }}
    >
      {/* Capa glass que aparece al hacer scroll */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--night)',
          opacity: bgOpacity,
          backdropFilter: 'blur(14px) saturate(120%)',
          WebkitBackdropFilter: 'blur(14px) saturate(120%)',
          borderBottom: border,
          zIndex: -1,
        }}
      />

      {/* Wordmark */}
      <Link
        href="/"
        className="font-serif"
        style={{ fontSize: 22, letterSpacing: 8, color: 'var(--ice)', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 400 }}
        aria-label="Azahara · inicio"
      >
        Azahara
      </Link>

      {/* Links desktop */}
      <nav aria-label="Navegación principal" className="hide-mobile" style={{ display: 'flex', gap: '2.4rem', alignItems: 'center' }}>
        {LINKS.map(([label, href]) => (
          <Link
            key={label}
            href={href}
            className="nav-link"
            style={{ fontSize: 11, letterSpacing: 3, color: 'var(--ice-dim)', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            {label}
          </Link>
        ))}
        <CartButton count={count} onOpen={() => setIsOpen(true)} />
      </nav>

      {/* Acciones móvil: carrito + hamburguesa */}
      <div className="only-mobile" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <CartButton count={count} onOpen={() => setIsOpen(true)} compact />
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5 }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--ice)', transition: 'transform .25s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--ice)', opacity: menuOpen ? 0 : 1, transition: 'opacity .2s' }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--ice)', transition: 'transform .25s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Panel móvil desplegable */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="only-mobile"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'rgba(10,14,23,0.96)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderBottom: '1px solid var(--border)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              padding: '12px 0',
            }}
          >
            {LINKS.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 13, letterSpacing: 3, color: 'var(--ice)', textTransform: 'uppercase', textDecoration: 'none', padding: '16px clamp(20px,10vw,200px)' }}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function CartButton({ count, onOpen, compact }: { count: number; onOpen: () => void; compact?: boolean }) {
  return (
    <button
      onClick={onOpen}
      aria-label={`Carrito, ${count} ${count === 1 ? 'artículo' : 'artículos'}`}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ice)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', padding: '6px 0' }}
    >
      {!compact && <span>Carrito</span>}
      <span style={{ position: 'relative', display: 'inline-flex' }} aria-hidden="true">
        {/* icono bolsa */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
          <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
        </svg>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ position: 'absolute', top: -6, right: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 16, height: 16, padding: '0 4px', borderRadius: '50%', background: 'linear-gradient(90deg,#eef1f5,#aeb9cc)', color: '#0a0e17', fontSize: 9, fontWeight: 700 }}
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </span>
    </button>
  )
}
