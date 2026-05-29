import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: 'var(--black-deep)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
