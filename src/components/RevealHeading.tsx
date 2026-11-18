import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { useMemo, type CSSProperties, type ElementType } from 'react'

const EASE = [0.76, 0, 0.24, 1] as const
const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.035 } } }
const letter: Variants = { hidden: { y: '110%' }, show: { y: 0, transition: { duration: 0.8, ease: EASE } } }

/** Section heading whose letters rise out of a mask when it scrolls into view. */
export default function RevealHeading({ text, as = 'h2', className = '', style }: { text: string; as?: ElementType; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion()
  const Comp = useMemo(() => motion.create(as), [as])
  // the chrome gradient is painted per letter, so transformed letters keep it
  const gradient = className.includes('hero-heading')
  const cls = className.replace('hero-heading', '').trim()
  return (
    <Comp
      className={cls}
      style={style}
      aria-label={text}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={parent}
    >
      {text.split(' ').map((w, wi, all) => (
        <span key={wi} aria-hidden="true" className="inline-block overflow-hidden pb-[0.06em] align-bottom">
          {w.split('').map((ch, ci) => (
            <motion.span key={ci} variants={letter} className={`inline-block ${gradient ? 'hero-heading' : ''}`}>
              {ch}
            </motion.span>
          ))}
          {wi < all.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Comp>
  )
}
