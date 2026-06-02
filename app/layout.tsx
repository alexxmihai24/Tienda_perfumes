import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/ui/Navbar'
import { CartDrawer } from '@/components/ui/CartDrawer'
import { Footer } from '@/components/ui/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-serif',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Azahara · Atelier de Parfum',
  description:
    'Fragancias de lujo artesanales. Oud de Laos, ámbar gris y esencias raras crafteadas con materias primas excepcionales.',
  keywords: ['perfume', 'lujo', 'oud', 'fragancia', 'artesanal', 'azahara'],
  openGraph: {
    title: 'Azahara · Atelier de Parfum',
    description: 'Fragancias de lujo artesanales con materias primas raras.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}>
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <div className="starfield" aria-hidden="true" />
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <div id="contenido" tabIndex={-1} style={{ outline: 'none' }}>
            {children}
          </div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
