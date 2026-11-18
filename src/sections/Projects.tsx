import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import FadeIn from '../components/FadeIn'
import RevealHeading from '../components/RevealHeading'
import { LiveProjectButton } from '../components/Buttons'
import { projects } from '../data'

type P = (typeof projects)[number]

/** Laptop-style browser window: whole first screen, nothing cropped. */
function Browser({ src, alt, domain }: { src: string; alt: string; domain: string }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-black/10 bg-white shadow-[0_30px_70px_-25px_rgba(12,12,12,.35)] sm:rounded-[18px]">
      <div className="flex items-center gap-3 border-b border-black/5 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto truncate rounded-md bg-black/[0.04] px-3 py-0.5 text-center font-mono text-[10px] text-[#0C0C0C]/60 sm:px-6 sm:text-xs">{domain}</div>
        <div className="w-[42px]" aria-hidden="true" />
      </div>
      <img src={src} alt={alt} loading="lazy" width={1440} height={900} className="block aspect-[16/10] w-full object-cover object-top" />
    </div>
  )
}

/** Phone with a thin bezel, overlapping the browser's corner. */
function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="rounded-[22px] border border-black/10 bg-[#0C0C0C] p-[5px] shadow-[0_25px_50px_-15px_rgba(12,12,12,.45)] sm:rounded-[30px] sm:p-[7px]">
      <div className="relative overflow-hidden rounded-[17px] sm:rounded-[23px]">
        <img src={src} alt={alt} loading="lazy" width={390} height={844} className="block aspect-[390/844] w-full object-cover object-top" />
        <span aria-hidden="true" className="absolute left-1/2 top-1.5 h-[9px] w-[30%] -translate-x-1/2 rounded-full bg-black sm:top-2 sm:h-3" />
      </div>
    </div>
  )
}

function Card({ p, index, total, progress }: { p: P; index: number; total: number; progress: MotionValue<number> }) {
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(progress, [index / total, 1], [1, targetScale])
  return (
    <div className="sticky top-24 flex h-[85vh] items-start md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px`, transformOrigin: 'top center' }}
        className="group relative grid w-full gap-6 overflow-hidden rounded-[40px] border border-black/10 bg-[radial-gradient(120%_120%_at_100%_0%,#F3E8F6_0%,#F4F4F5_55%)] p-5 sm:rounded-[50px] sm:p-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] md:items-center md:gap-10 md:rounded-[60px] md:p-10"
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(2.6rem, 7vw, 110px)' }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <div className="text-xs font-light uppercase tracking-widest text-[#0C0C0C]/60 sm:text-sm">{p.category}</div>
            <h3 className="mt-1 font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2.2rem)' }}>
              {p.name}
            </h3>
          </div>
          <p className="max-w-sm font-light leading-relaxed text-[#0C0C0C]/70">{p.desc}</p>
          <div>
            <LiveProjectButton href={p.href} />
          </div>
        </div>
        <div className="relative pb-6 pr-[12%] sm:pb-10">
          <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
            <Browser src={p.desktop} alt={`${p.name}: сайт на компʼютері`} domain={p.domain} />
          </div>
          <div className="absolute bottom-0 right-0 w-[24%] transition-transform duration-500 ease-out group-hover:-translate-y-2">
            <Phone src={p.mobile} alt={`${p.name}: сайт на телефоні`} />
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-white px-5 pb-24 pt-20 md:pb-32 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <RevealHeading text="Проєкти" className="hero-heading mb-12 text-center font-black uppercase leading-none tracking-tight sm:mb-16" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }} />
      <div ref={ref} className="mx-auto max-w-6xl">
        {projects.map((p, i) => (
          <Card key={p.name} p={p} index={i} total={projects.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
