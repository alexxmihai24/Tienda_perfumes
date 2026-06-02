import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(154,164,180,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>Inventario</p>
          <h1 className="font-light" style={{ fontSize: 24, letterSpacing: 2, color: '#fff' }}>Productos</h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          style={{ padding: '12px 28px', background: 'var(--gold)', color: '#000', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 700, textDecoration: 'none' }}
        >
          + Nuevo Producto
        </Link>
      </div>

      <div style={{ border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--black-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Producto', 'Coleccion', 'Precio', 'Stock', 'Estado', ''].map(h => (
                <th
                  key={h}
                  style={{ padding: '12px 16px', fontSize: 8, letterSpacing: 3, color: 'rgba(154,164,180,0.45)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 400 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(154,164,180,0.04)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {p.images[0] && (
                      <div style={{ position: 'relative', width: 40, height: 52, flexShrink: 0 }}>
                        <Image src={p.images[0]} alt={p.name} fill className="object-contain" style={{ mixBlendMode: 'luminosity' }} />
                      </div>
                    )}
                    <span style={{ fontSize: 13, color: '#fff', letterSpacing: 0.5 }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
                  {p.collection || '—'}
                </td>
                <td style={{ padding: '16px', fontSize: 13, color: 'var(--gold-light)' }}>
                  &#8364; {Number(p.price).toFixed(2)}
                </td>
                <td style={{ padding: '16px', fontSize: 13, color: p.stock < 10 ? 'rgba(248,113,113,0.8)' : 'rgba(74,222,128,0.75)' }}>
                  {p.stock}
                </td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      fontSize: 8,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 20,
                      background: p.active ? 'rgba(74,222,128,0.08)' : 'rgba(248,113,113,0.08)',
                      color: p.active ? 'rgba(74,222,128,0.75)' : 'rgba(248,113,113,0.75)',
                      border: `1px solid ${p.active ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}`,
                    }}
                  >
                    {p.active ? 'Activo' : 'Archivado'}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <Link
                    href={`/admin/productos/${p.id}`}
                    style={{ fontSize: 9, color: 'rgba(154,164,180,0.55)', letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none' }}
                  >
                    Editar &#8594;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
