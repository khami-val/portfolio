import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const MIN_MS = 2200
const WORD = 'khami.studio'
const EASE = [0.76, 0, 0.24, 1] as const

/** Minimal white loader: letters rise in, a hairline fills, then the screen lifts away. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  // progress: follows real page load, never finishes before MIN_MS
  useEffect(() => {
    const t0 = performance.now()
    let loaded = document.readyState === 'complete'
    const onLoad = () => (loaded = true)
    addEventListener('load', onLoad)
    const id = setInterval(() => {
      const timeP = Math.min(1, (performance.now() - t0) / MIN_MS)
      const eased = 1 - Math.pow(1 - timeP, 2)
      const p = loaded ? eased : Math.min(eased, 0.9)
      setPct(Math.round(p * 100))
      if (timeP >= 1 && loaded) { clearInterval(id); setLeaving(true) }
    }, 30)
    return () => { clearInterval(id); removeEventListener('load', onLoad) }
  }, [])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Завантаження ${pct}%`}
      className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-white text-[#0C0C0C]"
      initial={{ y: 0 }}
      animate={leaving ? (reduce ? { opacity: 0 } : { y: '-100%' }) : { y: 0 }}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE }}
      onAnimationComplete={() => leaving && onDone()}
      onClick={() => setLeaving(true)}
      title="Натисніть, щоб пропустити"
    >
      <motion.div
        className="flex flex-col items-center"
        animate={leaving && !reduce ? { y: 60, opacity: 0 } : undefined}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="flex overflow-hidden pb-[0.12em] font-black lowercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.8rem, 11vw, 9rem)' }} aria-hidden="true">
          {WORD.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={reduce ? false : { y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: EASE }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-8 w-[min(64vw,360px)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="h-px w-full bg-black/10">
            <div className="h-px bg-[#0C0C0C]" style={{ width: `${pct}%`, transition: 'width .12s linear' }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-black/45">
            <span>Завантаження</span>
            <span className="tabular-nums">{String(pct).padStart(3, '0')}</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
