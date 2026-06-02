'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid var(--border)',
  padding: '12px 16px',
  color: '#fff',
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: 4,
  color: 'var(--silver)',
  textTransform: 'uppercase',
  marginBottom: 8,
}

export function ProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    images: '',
    notesTop: '',
    notesHeart: '',
    notesBase: '',
    collection: '',
    featured: false,
  })

  function set(key: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [key]: value }))
    // Auto-slug from name
    if (key === 'name' && typeof value === 'string') {
      setForm(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-'),
      }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        notesTop: form.notesTop.split(',').map(s => s.trim()).filter(Boolean),
        notesHeart: form.notesHeart.split(',').map(s => s.trim()).filter(Boolean),
        notesBase: form.notesBase.split(',').map(s => s.trim()).filter(Boolean),
        collection: form.collection || undefined,
        featured: form.featured,
      }
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ? JSON.stringify(data.error) : 'Error al crear producto')
      setSuccess(true)
      setTimeout(() => router.push('/admin/productos'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass: [string, string, string, boolean?][] = [
    ['Nombre', 'name', 'text', true],
    ['Slug (URL)', 'slug', 'text', true],
    ['Precio (EUR)', 'price', 'number', true],
    ['Stock', 'stock', 'number', true],
    ['Coleccion', 'collection', 'text'],
    ['Imagen URL (separar por comas)', 'images', 'text', true],
    ['Notas de salida (separar por comas)', 'notesTop', 'text', true],
    ['Notas de corazon (separar por comas)', 'notesHeart', 'text', true],
    ['Notas de fondo (separar por comas)', 'notesBase', 'text', true],
  ]

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}
      aria-label="Formulario nuevo producto"
    >
      {fieldClass.map(([label, key, type, required]) => (
        <div key={key}>
          <label htmlFor={key} style={labelStyle}>
            {label} {required && <span style={{ color: 'rgba(248,113,113,0.6)' }}>*</span>}
          </label>
          <input
            id={key}
            type={type}
            value={form[key as keyof typeof form] as string}
            onChange={e => set(key, e.target.value)}
            required={required}
            step={type === 'number' ? '0.01' : undefined}
            min={type === 'number' ? '0' : undefined}
            style={inputStyle}
          />
        </div>
      ))}

      {/* Description */}
      <div>
        <label htmlFor="description" style={labelStyle}>
          Descripcion <span style={{ color: 'rgba(248,113,113,0.6)' }}>*</span>
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          required
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {/* Featured toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={e => set('featured', e.target.checked)}
          style={{ accentColor: 'var(--gold)', width: 16, height: 16 }}
        />
        <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0 }}>
          Destacado en Home
        </label>
      </div>

      {error && (
        <p role="alert" style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', letterSpacing: 0.5 }}>
          {error}
        </p>
      )}
      {success && (
        <p role="status" style={{ fontSize: 11, color: 'rgba(74,222,128,0.8)', letterSpacing: 1 }}>
          Producto creado. Redirigiendo...
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 36px',
            background: loading ? 'rgba(154,164,180,0.4)' : 'var(--gold)',
            color: '#000',
            fontSize: 9,
            letterSpacing: 5,
            textTransform: 'uppercase',
            fontWeight: 700,
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Guardando...' : 'Crear Producto'}
        </motion.button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ padding: '14px 24px', background: 'none', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', cursor: 'pointer' }}
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  )
}
