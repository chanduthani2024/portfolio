import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Cursor, Nav, Preloader } from './components/ui'
import { initScroll, scrollLock, store } from './hooks/store'
import { About, Contact, Experience, Hero, Life, Projects, Skills, Strip } from './sections/Sections'

const Scene = lazy(() => import('./scene/Scene'))

export default function App() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  useEffect(() => {
    const cleanup = initScroll()
    scrollLock(true)
    return cleanup
  }, [])

  useEffect(() => {
    if (ready) {
      store.ready = true
      scrollLock(false)
    }
  }, [ready])

  return (
    <>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      <Cursor />
      <Preloader onDone={onDone} />
      <Nav />
      <main>
        <Hero start={ready} />
        <Strip />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Life />
        <Contact />
      </main>
    </>
  )
}
