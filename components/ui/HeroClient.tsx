'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const AzaharaHero = dynamic(() => import('@/components/3d/AzaharaHero'), { ssr: false, loading: () => null })

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export function HeroClient() {
  const reduce = useReducedMotion()
  return (
    <section
      style={{
        position: 'relative',
        height: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(205,133,63,0.06), transparent 70%)',
          top: '50%',
          left: '-120px',
          transform: 'translateY(-50%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Text content — left half */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 10, paddingLeft: '10vw', maxWidth: '52%' }}
      >
        <motion.p
          variants={item}
          style={{
            fontSize: 8,
            letterSpacing: 7,
            color: 'rgba(205,133,63,0.55)',
            textTransform: 'uppercase',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ width: 28, height: 1, background: 'rgba(205,133,63,0.4)', display: 'inline-block' }} />
          Coleccion 2025
        </motion.p>

        <motion.h1
          variants={item}
          className="font-light"
          style={{
            fontSize: 'clamp(44px,5.5vw,82px)',
            lineHeight: 1.04,
            letterSpacing: -0.5,
            marginBottom: 28,
            color: '#ffffff',
            fontFamily: 'var(--font-serif)',
          }}
        >
          El arte<br />de la{' '}
          <span style={{ color: 'var(--gold-light)' }}>esencia</span>
          <br />pura
        </motion.h1>

        <motion.p
          variants={item}
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.9,
            maxWidth: 340,
            marginBottom: 48,
            letterSpacing: 0.3,
          }}
        >
          Fragancias crafteadas con materias primas raras. Cada botella, una obra que vive sobre tu piel durante horas.
        </motion.p>

        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Link
            href="/coleccion"
            style={{
              padding: '14px 36px',
              background: 'rgba(205,133,63,0.1)',
              border: '1px solid rgba(205,133,63,0.35)',
              color: 'var(--gold-light)',
              fontSize: 9,
              letterSpacing: 4,
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all 0.4s',
            }}
          >
            Explorar Coleccion
          </Link>
          <Link
            href="/coleccion"
            style={{
              fontSize: 9,
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Ver Historia <span style={{ color: 'rgba(205,133,63,0.5)' }}>&#8594;</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* 3D Canvas — right half */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '56%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <AzaharaHero />
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '10vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 8,
        }}
        aria-hidden="true"
      >
        <motion.div
          animate={reduce ? undefined : { scaleY: [1, 0.4, 1] }}
          transition={reduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 48,
            background: 'linear-gradient(180deg, rgba(205,133,63,0.5), transparent)',
            transformOrigin: 'top',
          }}
        />
        <span style={{ fontSize: 7, letterSpacing: 5, color: 'rgba(205,133,63,0.3)', textTransform: 'uppercase' }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
