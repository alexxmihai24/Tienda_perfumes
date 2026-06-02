'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaCarouselType } from 'embla-carousel'
import Link from 'next/link'
import Image from 'next/image'

interface CarouselProduct {
  id: string
  name: string
  slug: string
  price: number | { toString(): string }
  images: string[]
  notesHeart: string[]
  collection?: string | null
}

const TWEEN_FACTOR = 0.84

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)

export function ProductCarousel({ products }: { products: CarouselProduct[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: products.length > 2,
    align: 'center',
    containScroll: false,
    skipSnaps: false,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api.slideNodes().map(
      slide => slide.querySelector('.carousel-scale') as HTMLElement
    )
  }, [])

  const tweenScale = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine()
    const scrollProgress = api.scrollProgress()
    const slidesInView = api.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach(slideIndex => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach(loopItem => {
            const target = loopItem.target()
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const tween = 1 - Math.abs(diffToTarget * TWEEN_FACTOR)
        const scale = clamp(tween, 0.72, 1)
        const opacity = clamp(0.4 + tween * 0.6, 0.4, 1)
        const node = tweenNodes.current[slideIndex]
        if (node) {
          node.style.transform = `scale(${scale.toFixed(3)})`
          node.style.opacity = opacity.toFixed(3)
        }
      })
    })
  }, [])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    setTweenNodes(emblaApi)
    tweenScale(emblaApi)
    onSelect(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenScale)
      .on('reInit', onSelect)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)
      .on('select', onSelect)
  }, [emblaApi, setTweenNodes, tweenScale, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  if (products.length === 0) return null

  return (
    <div className="carousel-root">
      <style>{`
        .carousel-viewport { overflow: hidden; }
        .carousel-container { display: flex; touch-action: pan-y pinch-zoom; margin-left: -24px; }
        .carousel-slide { flex: 0 0 84%; min-width: 0; padding-left: 24px; }
        @media (min-width: 768px) { .carousel-slide { flex: 0 0 48%; } }
        @media (min-width: 1100px) { .carousel-slide { flex: 0 0 34%; } }
        .carousel-scale {
          transition: opacity 0.25s ease;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="carousel-viewport" ref={emblaRef}>
        <div className="carousel-container">
          {products.map(product => (
            <div className="carousel-slide" key={product.id}>
              <div className="carousel-scale">
                <Link
                  href={`/producto/${product.slug}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 14,
                    padding: '40px 32px 32px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* cold glow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-30%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '70%',
                      height: 220,
                      background: 'var(--glow)',
                      filter: 'blur(60px)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* photo */}
                  <div
                    style={{
                      position: 'relative',
                      height: 300,
                      marginBottom: 28,
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: 'linear-gradient(180deg, var(--surface-2), var(--ink))',
                    }}
                  >
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 84vw, 34vw"
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* info */}
                  {product.collection && (
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: 4,
                        color: 'var(--silver)',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}
                    >
                      {product.collection}
                    </p>
                  )}
                  <h3
                    className="font-light"
                    style={{
                      fontFamily: 'var(--font-serif, serif)',
                      fontSize: 24,
                      letterSpacing: 1,
                      color: 'var(--ice)',
                      marginBottom: 10,
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--ice-dim)',
                      marginBottom: 22,
                      lineHeight: 1.6,
                    }}
                  >
                    {product.notesHeart.slice(0, 3).join(' · ')}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 17, color: 'var(--ice)', letterSpacing: 1, fontWeight: 300 }}>
                      € {Number(product.price).toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: 'var(--silver)',
                        letterSpacing: 3,
                        textTransform: 'uppercase',
                      }}
                    >
                      Ver →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          marginTop: 40,
        }}
      >
        <CarouselButton dir="prev" onClick={scrollPrev} />

        <div style={{ display: 'flex', gap: 10 }}>
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al producto ${i + 1}`}
              onClick={() => scrollTo(i)}
              style={{
                width: i === selectedIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background: i === selectedIndex ? 'var(--ice)' : 'var(--border)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        <CarouselButton dir="next" onClick={scrollNext} />
      </div>
    </div>
  )
}

function CarouselButton({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Anterior' : 'Siguiente'}
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--ice)',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      {dir === 'prev' ? '←' : '→'}
    </button>
  )
}
