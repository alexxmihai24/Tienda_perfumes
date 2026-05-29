'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { motion, useScroll, useTransform } from 'framer-motion'

export function Navbar() {
  const { count, setIsOpen } = useCart()
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.92])
  const borderAlpha = useTransform(scrollY, [0, 80], [0, 0.12])

  return (
    <motion.nav
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 10vw' }}
    >
      <motion.div style={{ position: 'absolute', inset: 0, background: 'var(--black-deep)', opacity: bgOpacity, backdropFilter: 'blur(12px)', zIndex: -1, borderBottom: '1px solid var(--border)' }} />

      <Link href="/" style={{ fontSize: 11, letterSpacing: 7, color: 'var(--gold)', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 300 }} aria-label="Azahara inicio">
        Azahara
      </Link>

      <nav aria-label="Navegación principal" style={{ display: 'flex', gap: '2rem' }}>
        {[['Inicio', '/'], ['Colección', '/coleccion']].map(([label, href]) => (
          <Link key={label} href={href} style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.72)', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setIsOpen(true)}
        aria-label={`Carrito ${count} artículos`}
        style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', padding: '8px 0' }}
      >
        Carrito
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontSize: 9, fontWeight: 700 }}
            aria-hidden="true"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </button>
    </motion.nav>
  )
}
