import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

function Char({ ch, progress, range }: { ch: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative">
      <span className="opacity-0">{ch}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>
        {ch}
      </motion.span>
    </span>
  )
}

/** Characters brighten from 0.2 to 1 as the paragraph scrolls through the viewport. */
export default function AnimatedText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const words = text.split(' ')
  const total = text.length
  let i = 0
  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((w, wi) => {
        const start = i
        i += w.length + 1
        return (
          <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
            {w.split('').map((ch, ci) => {
              const p = (start + ci) / total
              return <Char key={ci} ch={ch} progress={scrollYProgress} range={[p, Math.min(1, p + 1 / total)]} />
            })}
            {wi < words.length - 1 && <span>&nbsp;</span>}
          </span>
        )
      })}
    </p>
  )
}
