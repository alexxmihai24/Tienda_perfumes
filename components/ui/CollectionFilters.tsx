'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface CollectionFiltersProps {
  collections: string[]
  activeCollection?: string
  activeSort?: string
}

export function CollectionFilters({ collections, activeCollection, activeSort }: CollectionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/coleccion?${params.toString()}`)
  }

  const pillStyle = (active: boolean) => ({
    padding: '6px 16px',
    border: '1px solid',
    borderColor: active ? 'rgba(205,133,63,0.5)' : 'rgba(205,133,63,0.12)',
    background: active ? 'rgba(205,133,63,0.1)' : 'transparent',
    color: active ? 'var(--gold-light)' : 'rgba(255,255,255,0.7)',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    transition: 'all 0.2s',
  })

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
      {/* Collection filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => setParam('collection', undefined)}
          style={pillStyle(!activeCollection)}
          aria-pressed={!activeCollection}
        >
          Todas
        </button>
        {collections.map(col => (
          <button
            key={col}
            onClick={() => setParam('collection', col)}
            style={pillStyle(activeCollection === col)}
            aria-pressed={activeCollection === col}
          >
            {col}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={activeSort || ''}
        onChange={e => setParam('sort', e.target.value || undefined)}
        aria-label="Ordenar por"
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          padding: '6px 12px',
          cursor: 'pointer',
          outline: 'none',
          marginLeft: 'auto',
        }}
      >
        <option value="">Mas recientes</option>
        <option value="price-asc">Precio: Menor a mayor</option>
        <option value="price-desc">Precio: Mayor a menor</option>
      </select>
    </div>
  )
}
