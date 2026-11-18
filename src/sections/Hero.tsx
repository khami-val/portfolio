import { ArrowRight, MapPin } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import Menu from '../components/Menu'
import avatar from '../assets/avatar.webp'
import { marquee } from '../data'

const links = [
  { label: 'Про мене', href: '#about', className: 'hidden md:block' },
  { label: 'Проєкти', href: '#projects' },
  { label: 'Бриф', href: '#brief' },
  { label: 'Контакт', href: '#contact' },
]

// 14 screens around the ring: client sites first, then the rest of the work
const screens = marquee.slice(0, 14)
while (screens.length < 14) screens.push(...screens.slice(0, 14 - screens.length))

const TAGLINE: [string, boolean][] = 'Створю для Вашого бізнесу'.split(' ').map((w) => [w, false] as [string, boolean])
  .concat('сайт, ШІ-адміністратора та відео,'.split(' ').map((w) => [w, true] as [string, boolean]))
  .concat('які приводять клієнтів'.split(' ').map((w) => [w, false] as [string, boolean]))

function Ring() {
  const reduce = useReducedMotion()
  const step = 360 / screens.length
  return (
    <motion.div
      aria-hidden="true"
      initial={reduce ? false : { opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="ring-stage pointer-events-none absolute inset-x-0 top-[11%] h-[25%] overflow-hidden sm:top-[10%] sm:h-[30%] [--card-h:178px] [--card-w:284px] [--p:470px] [--r:690px] sm:[--card-h:238px] sm:[--card-w:380px] sm:[--p:680px] sm:[--r:920px] lg:top-[7%] lg:h-[40%] lg:[--card-h:300px] lg:[--card-w:480px] lg:[--p:860px] lg:[--r:1200px]"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' }}
    >
      <div className="ring absolute left-1/2 top-1/2 h-0 w-0">
        {screens.map((s, i) => (
          <div
            key={i}
            className="ring-card absolute overflow-hidden rounded-xl border border-black/10 bg-[#F4F4F5] shadow-[0_18px_40px_-18px_rgba(12,12,12,.35)]"
            style={{
              width: 'var(--card-w)', height: 'var(--card-h)',
              left: 'calc(var(--card-w) / -2)', top: 'calc(var(--card-h) / -2)',
              transform: `rotateY(${i * step}deg) translateZ(calc(var(--r) * -1))`,
            }}
          >
            <img src={s.src} alt="" loading="eager" decoding="async" className="h-full w-full object-cover object-top" />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function Cta() {
  return (
    <a
      href="#brief"
      className="group inline-flex items-center gap-4 rounded-full border border-black/5 bg-white py-1.5 pl-1.5 pr-7 text-[#0C0C0C] shadow-[0_14px_36px_-10px_rgba(12,12,12,.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-10px_rgba(182,0,168,.45)] active:scale-[0.98]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0C0C0C] text-white transition-transform duration-300 group-hover:translate-x-1">
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium uppercase tracking-widest md:text-base">Почати проєкт</span>
    </a>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="relative h-[100svh] max-h-[900px] min-h-[620px] overflow-hidden lg:max-h-none bg-white text-[#0C0C0C]">
      <Ring />

      {/* top bar */}
      <FadeIn as="header" delay={0} y={-16} className="relative z-30 flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 md:px-14 md:pt-7">
        <a href="#" className="hero-heading text-2xl font-black uppercase leading-none tracking-tight md:text-[2rem]">
          khami.studio
        </a>
        <div className="hidden items-center gap-6 pt-1 text-sm font-light uppercase tracking-wide text-[#0C0C0C]/55 lg:flex">
          <span className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-[#16a34a]/50" />}
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#16a34a]" />
            </span>
            Беру нові проєкти
          </span>
          <span className="h-5 w-px bg-black/15" />
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#0C0C0C]/80" aria-hidden="true" />
            Працюю онлайн
          </span>
        </div>
        <Menu links={links} />
      </FadeIn>

      {/* avatar, anchored to the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 top-[22%] z-10 flex justify-center sm:top-[20%] lg:top-[14%]">
        <FadeIn delay={0.35} y={40}>
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-[10%_8%_0] -z-10 rounded-full blur-3xl" style={{ background: 'radial-gradient(closest-side, rgba(182,0,168,.28), rgba(118,33,176,.12) 60%, transparent 80%)' }} />
            <motion.img
              src={avatar}
              alt="Валерія, засновниця khami.studio"
              width={848}
              height={1200}
              draggable={false}
              className="block h-[min(64svh,640px)] w-auto select-none sm:h-[min(72svh,760px)] lg:h-[min(86svh,920px)]"
              style={{ maskImage: 'linear-gradient(180deg, #000 82%, transparent)', WebkitMaskImage: 'linear-gradient(180deg, #000 82%, transparent)' }}
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </FadeIn>
      </div>

      {/* bottom fade so the text stays readable over the avatar on small screens */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%] bg-gradient-to-t from-white via-white/80 to-transparent lg:h-[22%] lg:via-white/40" />

      {/* bottom-left (centered on phones): who + CTA */}
      <div className="absolute bottom-7 left-5 right-5 z-30 text-center sm:left-8 sm:right-8 md:bottom-12 md:left-14 md:right-auto md:text-left">
        <h1>
          <FadeIn as="span" delay={0.15} y={20} className="block text-xs font-light uppercase tracking-[0.3em] text-[#0C0C0C]/70 md:text-sm">Привіт, я Лера</FadeIn>
          <span className="mx-auto mt-4 block max-w-[640px] text-[clamp(1.6rem,6.7vw,2.75rem)] font-semibold uppercase leading-[1.08] tracking-tight text-[#0C0C0C]/45 md:mx-0 md:text-[clamp(1.5rem,2.9vw,2.75rem)] lg:max-w-[max(380px,calc(50vw-330px))] lg:text-[clamp(1.75rem,2.2vw,2.6rem)]">
            {TAGLINE.map(([w, strong], i) => (
              <motion.span
                key={i}
                className={`inline-block ${strong ? 'text-[#0C0C0C]' : ''}`}
                initial={reduce ? false : { opacity: 0, y: '0.6em', filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </span>
        </h1>
        <FadeIn delay={0.9} y={20} className="mt-6 flex justify-center md:hidden"><Cta /></FadeIn>
      </div>

      {/* bottom-right CTA on tablet/desktop */}
      <FadeIn delay={0.9} y={20} className="absolute bottom-12 right-14 z-30 hidden md:block"><Cta /></FadeIn>
    </section>
  )
}
