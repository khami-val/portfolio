import { useState } from 'react'
import Preloader from './components/Preloader'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Brief from './sections/Brief'
import Contact from './sections/Contact'

const KEY = 'embr-intro-seen'
function seen() {
  try { return sessionStorage.getItem(KEY) === '1' } catch { return false }
}

export default function App() {
  // the intro plays once per browser session
  const [intro, setIntro] = useState(() => !seen())
  const done = () => {
    try { sessionStorage.setItem(KEY, '1') } catch { /* private mode */ }
    setIntro(false)
  }
  return (
    <>
      {intro && <Preloader onDone={done} />}
      {/* sections mount after the intro so their entrance animations are seen */}
      {!intro && (
        <main className="bg-white" style={{ overflowX: 'clip' }}>
          <Hero />
          <About />
          <Services />
          <Projects />
          <Brief />
          <Contact />
        </main>
      )}
    </>
  )
}
