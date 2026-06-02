'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const item = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

/**
 * Hero — full-bleed product cover (public/hero.png) with a midnight gradient
 * overlay, staggered intro, and a subtle transform-only scroll parallax.
 * No WebGL: a single optimized image + CSS gradients. Fast and lag-free.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60])
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'var(--ink)',
      }}
    >
      {/* Background photo */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          scale: imgScale,
          y: imgY,
          zIndex: 0,
        }}
      >
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: 'cover', objectPosition: '70% 50%' }}
        />
      </motion.div>

      {/* Midnight overlay — legibility on the left + cool tint + bottom blend */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(90deg, rgba(5,7,12,0.94) 0%, rgba(5,7,12,0.78) 30%, rgba(5,7,12,0.35) 58%, rgba(5,7,12,0.05) 100%),' +
            'linear-gradient(0deg, var(--ink) 2%, transparent 38%),' +
            'radial-gradient(120% 90% at 18% 45%, rgba(58,74,107,0.25), transparent 60%)',
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '120px clamp(24px, 8vw, 120px) 80px',
        }}
      >
        <motion.div style={{ y: textY, maxWidth: 640 }}>
          <motion.p
            variants={item}
            style={{
              fontSize: 11,
              letterSpacing: 6,
              color: 'var(--silver)',
              textTransform: 'uppercase',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{ width: 32, height: 1, background: 'rgba(154,164,180,0.55)', display: 'inline-block' }} />
            Atelier de Parfum · 2026
          </motion.p>

          <motion.h1
            variants={item}
            className="font-serif"
            style={{
              fontSize: 'clamp(44px, 7.5vw, 104px)',
              lineHeight: 0.98,
              letterSpacing: -1,
              margin: '0 0 26px',
              color: 'var(--ice)',
              fontWeight: 300,
            }}
          >
            El arte de la
            <br />
            <span className="chrome-text" style={{ fontStyle: 'italic' }}>
              esencia
            </span>{' '}
            pura
          </motion.h1>

          <motion.p
            variants={item}
            style={{
              fontSize: 15,
              color: 'var(--ice-dim)',
              lineHeight: 1.9,
              maxWidth: 460,
              margin: '0 0 42px',
              letterSpacing: 0.3,
            }}
          >
            Fragancias crafteadas con materias primas raras. Cada botella, una obra que
            vive sobre tu piel durante horas.
          </motion.p>

          <motion.div
            variants={item}
            style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}
          >
            <Link href="/coleccion" className="btn-gold">
              Explorar colección
            </Link>
            <Link href="#destacados" className="btn-ghost">
              Ver destacados
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
          opacity: fade,
        }}
      >
        <motion.div
          animate={reduce ? undefined : { scaleY: [1, 0.4, 1] }}
          transition={reduce ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 1,
            height: 44,
            background: 'linear-gradient(180deg, var(--silver), transparent)',
            transformOrigin: 'top',
          }}
        />
        <span style={{ fontSize: 9, letterSpacing: 4, color: 'var(--silver)', textTransform: 'uppercase' }}>
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
