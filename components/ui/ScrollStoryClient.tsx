'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { storyData } from '@/components/3d/ScrollBottle'

const ScrollBottle = dynamic(
  () => import('@/components/3d/ScrollBottle').then(m => ({ default: m.ScrollBottle })),
  { ssr: false, loading: () => null }
)

export function ScrollStoryClient() {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      setProgress(total > 0 ? Math.min(1, scrolled / total) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const idx = Math.min(storyData.length - 1, Math.floor(progress * storyData.length))
  const story = storyData[idx]

  return (
    <section ref={sectionRef} style={{ minHeight: '250vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
          <ScrollBottle progress={progress} />
        </div>
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(205,133,63,0.06), transparent)',
            filter: 'blur(80px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'absolute', top: '50%', left: '10vw', transform: 'translateY(-50%)', maxWidth: 320, zIndex: 10 }}>
          <motion.div
            key={story.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ fontSize: 8, letterSpacing: 5, color: 'rgba(205,133,63,0.45)', textTransform: 'uppercase', marginBottom: 14 }}>
              {story.label}
            </p>
            <h2
              className="font-light"
              style={{ fontSize: 'clamp(26px,3.5vw,46px)', color: '#fff', letterSpacing: 1, lineHeight: 1.1, marginBottom: 20, fontFamily: 'var(--font-serif)' }}
            >
              {story.heading.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < story.heading.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <div style={{ width: 28, height: 1, background: 'rgba(205,133,63,0.4)', marginBottom: 16 }} />
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.85 }}>{story.body}</p>
          </motion.div>
        </div>
        <div
          role="tablist"
          aria-label="Historias"
          style={{ position: 'absolute', right: '10vw', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end', zIndex: 10 }}
        >
          {storyData.map((s, i) => (
            <div
              key={s.label}
              role="tab"
              aria-selected={i === idx}
              style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: i === idx ? 1 : 0.22, transition: 'opacity 0.4s' }}
            >
              <span style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(205,133,63,0.6)', textTransform: 'uppercase' }}>{s.label}</span>
              <div
                style={{
                  width: i === idx ? 6 : 4,
                  height: i === idx ? 6 : 4,
                  borderRadius: '50%',
                  background: i === idx ? 'var(--gold-light)' : 'rgba(205,133,63,0.4)',
                  transition: 'all 0.4s',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
