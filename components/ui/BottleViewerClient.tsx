'use client'
import dynamic from 'next/dynamic'

const BottleViewer = dynamic(() => import('@/components/3d/BottleViewer'), {
  ssr: false,
  loading: () => null,
})

export function BottleViewerClient() {
  return (
    <div
      style={{ width: '100%', height: 360, marginBottom: 8 }}
      aria-hidden="true"
    >
      <BottleViewer />
    </div>
  )
}
