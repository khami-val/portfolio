import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const MIN_MS = 2600
// monochrome: white → greys
const COLORS = ['#ffffff', '#f2f2f2', '#d9d9d9', '#bdbdbd', '#9a9a9a', '#e6e6e6']
const WORD = 'khami_val'

type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; r: number; c: string; delay: number; flick: number }

/** "Embers" loader: sparks rise from the bottom and gather into the khami_val wordmark. Calls onDone after load + MIN_MS. */
export default function PreloaderEmbers({ onDone }: { onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0
    let ps: P[] = []
    let dot = 1.5
    let sparks: P[] = []
    const t0 = performance.now()

    // sample the wordmark into target points
    const targets = () => {
      const o = document.createElement('canvas')
      let fs = 200
      o.width = W; o.height = H
      const g = o.getContext('2d')!
      const font = (n: number) => `800 ${n}px Montserrat, 'Arial Black', sans-serif`
      g.font = font(fs)
      fs = Math.min(220, (fs * W * 0.86) / g.measureText(WORD).width)
      g.font = font(fs)
      g.textAlign = 'center'; g.textBaseline = 'middle'
      g.fillText(WORD, W / 2, H / 2 - fs * 0.15)
      const d = g.getImageData(0, 0, W, H).data
      const step = Math.max(2, Math.min(6, Math.round(fs / 30)))
      dot = step * 0.32
      const pts: { x: number; y: number }[] = []
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y })
      return pts
    }
    const spark = (): P => ({
      x: Math.random() * W, y: H + Math.random() * 40, tx: 0, ty: 0,
      vx: (Math.random() - 0.5) * 0.6, vy: -(0.6 + Math.random() * 1.6),
      r: 0.6 + Math.random() * 1.6, c: COLORS[(Math.random() * 2) | 0], delay: 0, flick: Math.random() * 6,
    })
    const resize = () => {
      W = innerWidth; H = innerHeight
      c.width = W * dpr; c.height = H * dpr
      c.style.width = W + 'px'; c.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ps = targets().map((p) => ({
        x: Math.random() * W, y: H + Math.random() * H * 0.4, tx: p.x + (Math.random() - 0.5) * 3, ty: p.y + (Math.random() - 0.5) * 3,
        vx: 0, vy: 0, r: dot * (0.7 + Math.random() * 0.8),
        c: COLORS[(Math.random() * COLORS.length) | 0], delay: Math.random() * 0.9, flick: Math.random() * 6,
      }))
      sparks = Array.from({ length: W < 640 ? 40 : 90 }, spark).map((s) => ({ ...s, y: Math.random() * H }))
    }
    resize()
    addEventListener('resize', resize)

    let raf = 0
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      const t = (now - t0) / 1000
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(5,5,5,0.28)' // short motion trails
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'

      // free sparks drifting up
      for (const s of sparks) {
        s.x += s.vx + Math.sin(t * 2 + s.flick) * 0.3; s.y += s.vy
        if (s.y < -10) Object.assign(s, spark())
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 8 + s.flick)
        ctx.fillStyle = s.c
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill()
      }

      // embers flying into the letters
      for (const p of ps) {
        const k = Math.min(1, Math.max(0, (t - 0.2 - p.delay) / 1.1))
        const e = 1 - Math.pow(1 - k, 3)
        const sway = (1 - e) * Math.sin(t * 3 + p.flick) * 30
        const x = p.x + (p.tx - p.x) * e + sway
        const y = p.y + (p.ty - p.y) * e
        const glow = 0.55 + 0.45 * Math.sin(t * 6 + p.flick)
        ctx.globalAlpha = (0.25 + 0.75 * e) * glow
        ctx.fillStyle = p.c
        ctx.beginPath(); ctx.arc(x + (e === 1 ? Math.sin(t * 4 + p.flick) * 0.6 : 0), y, p.r * (1.6 - 0.6 * e), 0, 6.283); ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    if (reduce) {
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H)
      for (const p of ps) { ctx.fillStyle = p.c; ctx.fillRect(p.tx, p.ty, 2, 2) }
    } else {
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H)
      raf = requestAnimationFrame(draw)
    }
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
      className="fixed inset-0 z-[100] cursor-pointer bg-[#050505]"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.06 : 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={() => leaving && onDone()}
      onClick={() => setLeaving(true)}
      title="Натисніть, щоб пропустити"
    >
      <canvas ref={canvas} className="absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-4 sm:bottom-[18%]">
        <div className="text-xs font-light uppercase tracking-[0.5em] text-white/70 sm:text-sm">Розпалюємо ідеї</div>
        <div className="w-[min(60vw,280px)]">
          <div className="h-[2px] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: '#fff', boxShadow: '0 0 12px rgba(255,255,255,.8)', transition: 'width .1s linear' }}
            />
          </div>
          <div className="mt-2 text-center font-mono text-[11px] text-white/40">{pct}%</div>
        </div>
      </div>
    </motion.div>
  )
}
