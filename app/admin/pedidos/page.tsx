import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING:   { bg: 'rgba(251,191,36,0.08)',  text: 'rgba(251,191,36,0.8)',  border: 'rgba(251,191,36,0.15)' },
  PAID:      { bg: 'rgba(74,222,128,0.08)',   text: 'rgba(74,222,128,0.8)',  border: 'rgba(74,222,128,0.15)' },
  SHIPPED:   { bg: 'rgba(96,165,250,0.08)',   text: 'rgba(96,165,250,0.8)',  border: 'rgba(96,165,250,0.15)' },
  DELIVERED: { bg: 'rgba(52,211,153,0.08)',   text: 'rgba(52,211,153,0.8)',  border: 'rgba(52,211,153,0.15)' },
  CANCELLED: { bg: 'rgba(248,113,113,0.08)',  text: 'rgba(248,113,113,0.8)', border: 'rgba(248,113,113,0.15)' },
}

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(205,133,63,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
          Historial
        </p>
        <h1 className="font-light" style={{ fontSize: 24, letterSpacing: 2, color: '#fff' }}>
          Pedidos
        </h1>
      </div>

      <div style={{ border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--black-card)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['ID Pedido', 'Cliente', 'Total', 'Items', 'Estado', 'Fecha'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: 8, letterSpacing: 3, color: 'rgba(205,133,63,0.45)', textTransform: 'uppercase', textAlign: 'left', fontWeight: 400 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                  No hay pedidos todavia.
                </td>
              </tr>
            ) : orders.map(o => {
              const colors = STATUS_COLORS[o.status] ?? STATUS_COLORS.PENDING
              return (
                <tr key={o.id} style={{ borderBottom: '1px solid rgba(205,133,63,0.04)' }}>
                  <td style={{ padding: '16px', fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>
                    {o.id.slice(0, 12)}&#8230;
                  </td>
                  <td style={{ padding: '16px' }}>
                    <p style={{ fontSize: 12, color: '#fff', marginBottom: 2 }}>{o.customerName}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{o.customerEmail}</p>
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, color: 'var(--gold-light)', fontWeight: 300 }}>
                    &#8364; {Number(o.total).toFixed(2)}
                  </td>
                  <td style={{ padding: '16px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                    {o.items.length} {o.items.length === 1 ? 'art.' : 'arts.'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span
                      style={{
                        fontSize: 8,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: colors.bg,
                        color: colors.text,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>
                    {new Date(o.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
