import { useEffect, useRef, useState } from 'react'
import { marquee } from '../data'

const half = Math.ceil(marquee.length / 2)
const row1 = [...marquee.slice(0, half), ...marquee.slice(0, half), ...marquee.slice(0, half)]
const row2 = [...marquee.slice(half), ...marquee.slice(half), ...marquee.slice(half)]

function Tile({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" width={420} height={270} className="h-[270px] w-[420px] flex-none rounded-2xl object-cover" />
}

/** Two rows that slide in opposite directions as the page scrolls. */
export default function Marquee() {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY
      setOffset((window.scrollY - top + window.innerHeight) * 0.3)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={ref} aria-label="Роботи EMBR" className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex w-max gap-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: 'transform', marginLeft: '-1300px' }}>
        {row1.map((m, i) => <Tile key={i} {...m} />)}
      </div>
      <div className="flex w-max gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}>
        {row2.map((m, i) => <Tile key={i} {...m} />)}
      </div>
    </section>
  )
}
