import Lenis from 'lenis'

/** Shared, non-reactive state read every frame by the 3D scene. */
export const store = {
  /** Continuous section index: 2.35 = 35% of the way from section 2 to 3. */
  section: 0,
  scrollY: 0,
  mouse: { x: 0, y: 0 },
  ready: false,
}

export const SECTION_IDS = ['hero', 'about', 'skills', 'experience', 'projects', 'life', 'contact'] as const

let tops: number[] = []
let lenis: Lenis | null = null

function measure() {
  tops = SECTION_IDS.map((id) => document.getElementById(id)?.offsetTop ?? 0)
}

function updateSection(y: number) {
  store.scrollY = y
  if (!tops.length) return
  let i = 0
  for (let k = 0; k < tops.length; k++) if (y + window.innerHeight * 0.45 >= tops[k]) i = k
  const start = tops[i] - window.innerHeight * 0.45
  const end = (tops[i + 1] ?? tops[i] + window.innerHeight) - window.innerHeight * 0.45
  const f = Math.min(1, Math.max(0, (y - start) / Math.max(1, end - start)))
  store.section = i + (i === tops.length - 1 ? 0 : f)
}

export function initScroll() {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
  lenis.on('scroll', ({ scroll }: { scroll: number }) => updateSection(scroll))
  let raf = 0
  const loop = (t: number) => {
    lenis?.raf(t)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  measure()
  updateSection(window.scrollY)
  const ro = new ResizeObserver(() => {
    measure()
    updateSection(lenis?.scroll ?? window.scrollY)
  })
  ro.observe(document.body)

  const onMove = (e: PointerEvent) => {
    store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    store.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener('pointermove', onMove)

  return () => {
    cancelAnimationFrame(raf)
    ro.disconnect()
    window.removeEventListener('pointermove', onMove)
    lenis?.destroy()
    lenis = null
  }
}

export const scrollLock = (lock: boolean) => (lock ? lenis?.stop() : lenis?.start())

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el && lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
}
