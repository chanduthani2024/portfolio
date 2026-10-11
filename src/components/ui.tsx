import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { SECTION_IDS, scrollToId, store } from '../hooks/store'

export const ease = [0.16, 1, 0.3, 1] as const

/* ---------- Preloader ---------- */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    let t1 = 0
    let t2 = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1900)
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        t1 = window.setTimeout(() => {
          setLeaving(true)
          onDone()
          t2 = window.setTimeout(() => setGone(true), 1100)
        }, 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  if (gone) return null
  return (
    <div className={`preloader ${leaving ? 'preloader--leave' : ''}`}>
      <div className="preloader__inner">
        <span className="mono">Loading universe</span>
        <div className="preloader__num">{String(n).padStart(3, '0')}</div>
        <div className="preloader__bar">
          <i style={{ transform: `scaleX(${n / 100})` }} />
        </div>
      </div>
      <span className="preloader__brand">CT.</span>
    </div>
  )
}

/* ---------- Custom cursor ---------- */
export function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [big, setBig] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = (e.target as HTMLElement).closest('a,button,[data-cursor]') as HTMLElement | null
      setBig(!!t)
      setLabel(t?.dataset.cursor ?? '')
    }
    window.addEventListener('pointermove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [x, y])

  return (
    <motion.div className={`cursor ${big ? 'cursor--big' : ''}`} style={{ x: sx, y: sy }} aria-hidden>
      <span>{label}</span>
    </motion.div>
  )
}

/* ---------- Nav + scroll progress ---------- */
const labels: Record<string, string> = {
  hero: 'Intro',
  about: 'About',
  skills: 'Skills',
  experience: 'Work',
  projects: 'Projects',
  life: 'Life',
  contact: 'Contact',
}

export function Nav() {
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setActive(Math.round(store.section)), 150)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <motion.div className="progress" style={{ scaleX: w }} />
      <header className="nav">
        <button className="nav__logo" onClick={() => scrollToId('hero')} aria-label="Back to top">
          CT<span>.</span>
        </button>
        <nav className="nav__links" aria-label="Sections">
          {SECTION_IDS.slice(1).map((id, i) => (
            <button key={id} className={active === i + 1 ? 'is-active' : ''} onClick={() => scrollToId(id)}>
              {labels[id]}
            </button>
          ))}
        </nav>
        <Magnetic>
          <button className="pill pill--solid" onClick={() => scrollToId('contact')}>
            Let’s talk
          </button>
        </Magnetic>
        <button className="nav__menu" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
      <div className={`mmenu ${open ? 'is-open' : ''}`}>
        {SECTION_IDS.slice(1).map((id, i) => (
          <button
            key={id}
            onClick={() => {
              setOpen(false)
              setTimeout(() => scrollToId(id), 200)
            }}
          >
            <span>0{i + 1}</span>
            {labels[id]}
          </button>
        ))}
      </div>
      <div className="dots" aria-hidden>
        {SECTION_IDS.map((id, i) => (
          <button key={id} className={active === i ? 'is-active' : ''} onClick={() => scrollToId(id)} tabIndex={-1}>
            <i />
          </button>
        ))}
      </div>
    </>
  )
}

/* ---------- Reveal helpers ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/** Splits a heading into words that rise out of a mask. */
export function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3'
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words = text.split(' ')
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span className="mask" key={i} aria-hidden>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', rotate: 4 }}
            animate={inView ? { y: 0, rotate: 0 } : {}}
            transition={{ duration: 1.1, delay: delay + i * 0.07, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <Reveal y={16} className="label">
      <span className="mono">{n}</span>
      <i />
      <span className="mono">{children}</span>
    </Reveal>
  )
}

/* ---------- 3D tilt card ---------- */
export function Tilt({
  children,
  className = '',
  max = 9,
  glare = true,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 220, damping: 20 })
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 220, damping: 20 })

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    x.set(px - 0.5)
    y.set(py - 0.5)
    ref.current!.style.setProperty('--mx', `${px * 100}%`)
    ref.current!.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`tilt ${glare ? 'tilt--glare' : ''} ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Magnetic wrapper ---------- */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Count-up ---------- */
export function CountUp({ to, decimals = 0, suffix = '', text }: { to: number; decimals?: number; suffix?: string; text?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600)
      setV((1 - Math.pow(1 - p, 4)) * to)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref}>
      {text && v >= to * 0.999 ? text : v.toFixed(decimals)}
      {!(text && v >= to * 0.999) && suffix}
    </span>
  )
}

/* ---------- Marquee ---------- */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = [...items, ...items]
  return (
    <div className={`marquee ${reverse ? 'marquee--rev' : ''}`} aria-hidden>
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i}>
            {t}
            <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  )
}
