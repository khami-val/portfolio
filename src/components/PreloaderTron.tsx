import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const MIN_MS = 2200
const CYAN = '#5ef6ff'
const ORANGE = '#ff8a1f'

type Cycle = { x: number; y: number; dx: number; dy: number; color: string; trail: { x: number; y: number }[]; speed: number }

/** Full-screen Tron-style loader: neon grid, light cycles leaving glowing trails. Calls onDone after load + MIN_MS. */
export default function PreloaderTron({ onDone }: { onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, G = 40
    let cycles: Cycle[] = []
    const snap = (v: number) => Math.round(v / G) * G
    const spawn = (i: number): Cycle => {
      const horiz = Math.random() < 0.5
      const dir = Math.random() < 0.5 ? 1 : -1
      const x = horiz ? (dir > 0 ? 0 : snap(W)) : snap(Math.random() * W)
      const y = horiz ? snap(Math.random() * H) : (dir > 0 ? 0 : snap(H))
      return { x, y, dx: horiz ? dir : 0, dy: horiz ? 0 : dir, color: i % 3 === 2 ? ORANGE : CYAN, trail: [{ x, y }], speed: 4 + Math.random() * 3 }
    }
    const resize = () => {
      W = innerWidth; H = innerHeight
      G = W < 640 ? 32 : 48
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cycles = Array.from({ length: W < 640 ? 5 : 8 }, (_, i) => spawn(i))
    }
    resize()
    addEventListener('resize', resize)

    const grid = () => {
      ctx.fillStyle = '#02060a'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(94,246,255,0.09)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x <= W; x += G) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, H) }
      for (let y = 0; y <= H; y += G) { ctx.moveTo(0, y + 0.5); ctx.lineTo(W, y + 0.5) }
      ctx.stroke()
    }

    let raf = 0
    const draw = () => {
      raf = requestAnimationFrame(draw)
      grid()
      cycles.forEach((cy, i) => {
        // move; at each grid crossing maybe turn 90°
        for (let s = 0; s < cy.speed; s++) {
          cy.x += cy.dx; cy.y += cy.dy
          if (cy.x % G === 0 && cy.y % G === 0 && Math.random() < 0.18) {
            cy.trail.push({ x: cy.x, y: cy.y })
            const turn = Math.random() < 0.5 ? 1 : -1
            if (cy.dx !== 0) { cy.dy = turn; cy.dx = 0 } else { cy.dx = turn; cy.dy = 0 }
          }
        }
        if (cy.trail.length > 7) cy.trail.shift()
        if (cy.x < -G || cy.y < -G || cy.x > W + G || cy.y > H + G) { cycles[i] = spawn(i); return }
        const pts = [...cy.trail, { x: cy.x, y: cy.y }]
        ctx.save()
        ctx.lineCap = 'round'; ctx.lineJoin = 'round'
        ctx.shadowColor = cy.color; ctx.shadowBlur = 18
        ctx.strokeStyle = cy.color; ctx.lineWidth = 3
        ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke()
        ctx.shadowBlur = 0; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1
        ctx.stroke()
        // head
        ctx.shadowColor = cy.color; ctx.shadowBlur = 24; ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(cy.x, cy.y, 3.5, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      })
    }
    if (reduce) grid()
    else raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize) }
  }, [])

  // progress: follows real page load, never finishes before MIN_MS
  useEffect(() => {
    const t0 = performance.now()
    let loaded = document.readyState === 'complete'
    const onLoad = () => (loaded = true)
    addEventListener('load', onLoad)
    const id = setInterval(() => {
      const timeP = Math.min(1, (performance.now() - t0) / MIN_MS)
      const p = loaded ? timeP : Math.min(timeP, 0.9)
      setPct(Math.round(p * 100))
      if (p >= 1) { clearInterval(id); setLeaving(true) }
    }, 40)
    return () => { clearInterval(id); removeEventListener('load', onLoad) }
  }, [])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Завантаження ${pct}%`}
      className="fixed inset-0 z-[100] cursor-pointer bg-[#02060a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={() => leaving && onDone()}
      onClick={() => setLeaving(true)}
      title="Натисніть, щоб пропустити"
    >
      <canvas ref={canvas} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5" style={{ background: 'radial-gradient(closest-side, rgba(2,6,10,.92), rgba(2,6,10,.5) 65%, transparent)' }}>
        <div className="font-mono text-sm uppercase tracking-[0.4em] sm:text-base" style={{ color: CYAN, textShadow: `0 0 12px ${CYAN}` }}>
          Вхід у систему…
        </div>
        <div className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}>
          EMBR
        </div>
        <div className="w-[min(70vw,320px)]">
          <div className="h-[3px] overflow-hidden rounded-full" style={{ background: 'rgba(94,246,255,.15)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CYAN, boxShadow: `0 0 10px ${CYAN}, 0 0 20px ${CYAN}`, transition: 'width .1s linear' }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-xs" style={{ color: 'rgba(94,246,255,.8)' }}>
            <span>entering the grid</span>
            <span>{String(pct).padStart(3, '0')}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
