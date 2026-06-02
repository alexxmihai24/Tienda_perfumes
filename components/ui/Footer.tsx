import Link from 'next/link'
import { NewsletterForm } from '@/components/ui/NewsletterForm'

export function Footer() {
  return (
    <footer style={{ padding: '64px 10vw 32px', borderTop: '1px solid var(--border)', background: 'var(--black-deep)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: 48 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: 7, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16, fontWeight: 300 }}>
            Azahara
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 220 }}>
            Atelier de perfumeria artesanal. Fragancias crafteadas con materias primas raras.
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: 5, color: 'var(--silver)', textTransform: 'uppercase', marginBottom: 16 }}>
            Navegacion
          </p>
          <nav aria-label="Footer nav">
            {[['Coleccion', '/coleccion'], ['Nosotros', '/'], ['Contacto', '/']].map(([label, href]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link href={href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', letterSpacing: 1 }}>
                  {label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
        <div>
          <p style={{ fontSize: 11, letterSpacing: 5, color: 'var(--silver)', textTransform: 'uppercase', marginBottom: 16 }}>
            Newsletter
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.6 }}>
            Recibe novedades y lanzamientos exclusivos.
          </p>
          <NewsletterForm compact />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
          &copy; {new Date().getFullYear()} Azahara &middot; Todos los derechos reservados
        </p>
        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: 2, textTransform: 'uppercase' }}>
          Crafted with rare materials
        </p>
      </div>
    </footer>
  )
}
