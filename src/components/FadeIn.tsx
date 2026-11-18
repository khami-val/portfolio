import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { useMemo } from 'react'

type Props = {
  children: ReactNode
  as?: ElementType
  delay?: number
  duration?: number
  x?: number
  y?: number
  className?: string
  [key: string]: unknown
}

export default function FadeIn({ children, as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, className, ...rest }: Props) {
  const reduce = useReducedMotion()
  const Comp = useMemo(() => motion.create(as as ElementType), [as])
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  )
}
