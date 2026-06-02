import { ProductForm } from '@/components/admin/ProductForm'

export default function NuevoProductoPage() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(154,164,180,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
          Inventario
        </p>
        <h1 className="font-light" style={{ fontSize: 24, letterSpacing: 2, color: '#fff' }}>
          Nuevo Producto
        </h1>
      </div>
      <ProductForm />
    </div>
  )
}
