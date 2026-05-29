export function MarqueeStrip({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: 'hidden', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--black-deep)' }} aria-hidden="true">
      <div style={{ display: 'flex', gap: 56, width: 'max-content', animation: 'marquee 30s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: 8, letterSpacing: 6, color: 'rgba(205,133,63,0.28)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {item} <span style={{ color: 'rgba(205,133,63,0.45)', fontSize: 10 }}>&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  )
}
