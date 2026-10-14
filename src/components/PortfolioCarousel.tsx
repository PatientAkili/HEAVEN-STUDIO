import { useCallback, useEffect, useRef, useState } from 'react'

interface CarouselItem {
  src: string
  title: string
}

interface PortfolioCarouselProps<T extends CarouselItem> {
  works: T[]
  onOpen: (work: T) => void
}

const AUTOPLAY_MS = 4000 // mettre 0 pour désactiver le défilement automatique
const RESUME_AFTER_MS = 6000

// Distance entre deux photos (largeur d'une carte + espace)
function getStep(el: HTMLElement): number {
  const first = el.children[0] as HTMLElement | undefined
  const second = el.children[1] as HTMLElement | undefined
  return first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

function PortfolioCarousel<T extends CarouselItem>({ works, onOpen }: PortfolioCarouselProps<T>) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const [canScroll, setCanScroll] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [inView, setInView] = useState(true)

  // Met à jour la barre de progression (sans redessiner tout le composant)
  const updateBar = useCallback(() => {
    const el = trackRef.current
    if (!el || el.scrollWidth <= 0) return
    const scrollable = el.scrollWidth - el.clientWidth > 4
    setCanScroll((prev) => (prev === scrollable ? prev : scrollable))
    if (barRef.current) barRef.current.style.visibility = scrollable ? 'visible' : 'hidden'
    if (thumbRef.current) {
      thumbRef.current.style.left = `${(el.scrollLeft / el.scrollWidth) * 100}%`
      thumbRef.current.style.width = `${Math.min(100, (el.clientWidth / el.scrollWidth) * 100)}%`
    }
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateBar()
    el.addEventListener('scroll', updateBar, { passive: true })
    window.addEventListener('resize', updateBar)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateBar) : null
    ro?.observe(el)
    return () => {
      el.removeEventListener('scroll', updateBar)
      window.removeEventListener('resize', updateBar)
      ro?.disconnect()
    }
  }, [updateBar, works.length])

  // Le défilement automatique ne tourne que si le carrousel est visible à l'écran
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  const paused = hovering || interacting || !inView

  useEffect(() => {
    if (AUTOPLAY_MS <= 0 || paused || works.length < 2) return
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || document.hidden) return
      const max = el.scrollWidth - el.clientWidth
      if (max <= 4) return
      if (el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: getStep(el), behavior: 'smooth' })
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [paused, works.length])

  // Quand le visiteur agit, on met le défilement automatique en pause quelques secondes
  const markInteraction = () => {
    setInteracting(true)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setInteracting(false), RESUME_AFTER_MS)
  }

  const go = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    markInteraction()
    const max = el.scrollWidth - el.clientWidth
    if (dir === 1 && el.scrollLeft >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' })
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: max, behavior: 'smooth' })
    else el.scrollBy({ left: dir * getStep(el), behavior: 'smooth' })
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) markInteraction()
  }

  if (works.length === 0) {
    return <p style={styles.empty}>Aucune réalisation dans cette catégorie pour le moment.</p>
  }

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Réalisations du portfolio"
      style={styles.wrap}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      onKeyDown={onKeyDown}
      onTouchStart={markInteraction}
      onPointerDown={markInteraction}
      onWheel={onWheel}
    >
      <style>{`
        .pc-track {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-padding-left: 2px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          padding: 8px 2px 18px;
        }
        .pc-track::-webkit-scrollbar { display: none; }

        .pc-slide {
          position: relative;
          flex: 0 0 calc((100% - 2rem) / 3);
          scroll-snap-align: start;
          aspect-ratio: 4 / 5;
          padding: 0;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 14px;
          overflow: hidden;
          background: rgba(30, 27, 75, 0.5);
          cursor: pointer;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        .pc-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          transition: transform 0.5s ease, filter 0.35s ease;
        }
        .pc-zoom {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0));
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .pc-zoom-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pc-slide:hover,
        .pc-slide:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(147, 51, 234, 0.35);
        }
        .pc-slide:hover img { transform: scale(1.06); filter: brightness(0.85); }
        .pc-slide:hover .pc-zoom,
        .pc-slide:focus-visible .pc-zoom { opacity: 1; }
        .pc-slide:focus-visible { outline: 2px solid #A78BFA; outline-offset: 2px; }

        .pc-arrow {
          position: absolute;
          top: calc(50% - 4px);
          transform: translateY(-50%);
          z-index: 2;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(30, 27, 75, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #FFFFFF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .pc-arrow:hover { background: rgba(147, 51, 234, 0.8); transform: translateY(-50%) scale(1.08); }
        .pc-prev { left: 8px; }
        .pc-next { right: 8px; }

        @media (max-width: 900px) {
          .pc-slide { flex-basis: calc((100% - 1rem) / 2); }
        }
        @media (max-width: 600px) {
          .pc-slide { flex-basis: 78%; }
          .pc-arrow { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pc-slide, .pc-slide img, .pc-zoom, .pc-arrow { transition: none; }
        }
      `}</style>

      <div style={styles.stage}>
        {canScroll && (
          <button type="button" className="pc-arrow pc-prev" onClick={() => go(-1)} aria-label="Photo précédente">
            <ChevronIcon dir="left" />
          </button>
        )}

        <div ref={trackRef} className="pc-track">
          {works.map((work, i) => (
            <button
              key={`${i}-${work.src}`}
              type="button"
              className="pc-slide"
              onClick={() => onOpen(work)}
              aria-label={work.title || 'Agrandir la photo'}
            >
              <img src={work.src} alt="" loading="lazy" draggable={false} />
              <span className="pc-zoom">
                <span className="pc-zoom-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <line x1="16.5" y1="16.5" x2="21" y2="21" />
                  </svg>
                </span>
              </span>
            </button>
          ))}
        </div>

        {canScroll && (
          <button type="button" className="pc-arrow pc-next" onClick={() => go(1)} aria-label="Photo suivante">
            <ChevronIcon dir="right" />
          </button>
        )}
      </div>

      <div ref={barRef} style={styles.bar} aria-hidden="true">
        <span ref={thumbRef} style={styles.thumb} />
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  wrap: {
    width: '100%',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 1.5rem 3rem',
    position: 'relative',
  },
  stage: { position: 'relative' },
  bar: {
    position: 'relative',
    height: '4px',
    maxWidth: '240px',
    margin: '0.5rem auto 0',
    borderRadius: '999px',
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    overflow: 'hidden',
    visibility: 'hidden',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    borderRadius: '999px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #9333EA 100%)',
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: '0.9rem',
    padding: '0 1.5rem 3rem',
    margin: 0,
  },
}

export default PortfolioCarousel
