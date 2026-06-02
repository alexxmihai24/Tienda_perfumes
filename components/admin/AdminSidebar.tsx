'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '&#9672;' },
  { href: '/admin/productos', label: 'Productos', icon: '&#9671;' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '&#9633;' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -12, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: 220,
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 16px',
        borderRight: '1px solid var(--border)',
        background: 'var(--black-card)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Branding */}
      <div style={{ paddingLeft: 12, marginBottom: 48 }}>
        <p style={{ fontSize: 10, letterSpacing: 6, color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 300 }}>
          Azahara
        </p>
        <p style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', marginTop: 4 }}>
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }} aria-label="Navegacion admin">
        {NAV_LINKS.map(({ href, label, icon }) => {
          const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 2,
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(154,164,180,0.1)' : 'transparent',
                borderLeft: `2px solid ${isActive ? 'var(--gold)' : 'transparent'}`,
                transition: 'all 0.2s',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span dangerouslySetInnerHTML={{ __html: icon }} style={{ fontSize: 12, opacity: 0.7 }} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: '/admin/login' })}
        style={{
          fontSize: 8,
          letterSpacing: 4,
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          padding: '10px 12px',
          transition: 'color 0.2s',
        }}
      >
        Cerrar Sesion &#8594;
      </button>
    </motion.aside>
  )
}
