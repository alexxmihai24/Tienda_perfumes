export function MarqueeStrip({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--ink)' }} aria-hidden="true">
      <div style={{ display: 'flex', gap: 56, width: 'max-content', animation: 'marquee 30s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 10, letterSpacing: 6, color: 'rgba(154,164,180,0.5)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {item} <span style={{ color: 'var(--silver)', fontSize: 10 }}>&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
