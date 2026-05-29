import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [totalOrders, revenueData, pendingOrders, lowStock, totalProducts] = await Promise.all([
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count({ where: { stock: { lt: 10 }, active: true } }),
    prisma.product.count({ where: { active: true } }),
  ])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const ordersToday = await prisma.order.count({ where: { createdAt: { gte: todayStart } } })

  const metrics = [
    { label: 'Pedidos pagados', value: totalOrders, color: 'rgba(74,222,128,0.75)', icon: '&#9672;' },
    { label: 'Ingresos totales', value: `€ ${Number(revenueData._sum.total || 0).toFixed(2)}`, color: 'var(--gold-light)', icon: '&#9670;' },
    { label: 'Pedidos pendientes', value: pendingOrders, color: 'rgba(251,191,36,0.75)', icon: '&#9661;' },
    { label: 'Stock bajo', value: lowStock, color: 'rgba(248,113,113,0.75)', icon: '&#9651;' },
    { label: 'Pedidos hoy', value: ordersToday, color: 'rgba(96,165,250,0.75)', icon: '&#9634;' },
    { label: 'Productos activos', value: totalProducts, color: 'rgba(255,255,255,0.55)', icon: '&#9633;' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(205,133,63,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
          Panel de control
        </p>
        <h1 className="font-light" style={{ fontSize: 28, letterSpacing: 2, color: '#fff' }}>
          Dashboard
        </h1>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 48,
        }}
      >
        {metrics.map(({ label, value, color, icon }) => (
          <div
            key={label}
            style={{
              padding: '24px',
              border: '1px solid var(--border)',
              background: 'var(--black-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <p style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>{label}</p>
              <span style={{ color: 'rgba(205,133,63,0.25)', fontSize: 12 }} dangerouslySetInnerHTML={{ __html: icon }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 300, color, letterSpacing: 1 }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid var(--border)', padding: 24, background: 'var(--black-card)' }}>
        <p style={{ fontSize: 9, letterSpacing: 4, color: 'rgba(205,133,63,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
          Accesos rapidos
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['Nuevo Producto', '/admin/productos/nuevo'], ['Ver Pedidos', '/admin/pedidos'], ['Ver Productos', '/admin/productos']].map(([label, href]) => (
            <a key={href} href={href} style={{ padding: '10px 20px', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.2s' }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
