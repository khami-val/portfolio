import FadeIn from '../components/FadeIn'
import Magnet from '../components/Magnet'
import { ContactButton } from '../components/Buttons'
import { motion, useReducedMotion } from 'framer-motion'
import avatar from '../assets/avatar.webp'

const links = [
  { label: 'Про мене', href: '#about' },
  { label: 'Ціни', href: '#prices' },
  { label: 'Проєкти', href: '#projects' },
  { label: 'Контакт', href: '#contact' },
]

export default function HeroV5() {
  const reduce = useReducedMotion()
  return (
    <section className="relative flex h-[100svh] min-h-[560px] flex-col" style={{ overflowX: 'clip' }}>
      <FadeIn as="nav" delay={0} y={-20} aria-label="Розділи" className="relative z-20 flex justify-between px-6 pt-6 md:px-10 md:pt-8">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
          >
            {l.label}
          </a>
        ))}
      </FadeIn>

      {/* no overflow-hidden here: a clipped heading never intersects, so whileInView would not fire on small screens */}
      <div>
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight text-[8.6vw] sm:mt-5 lg:text-[8.2vw]"
        >
          Привіт, я Лера!
        </FadeIn>
      </div>

      {/* avatar sits in the flow between heading and tagline; height follows the viewport */}
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center pt-2 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:top-[12%] md:items-end md:pt-0">
        <FadeIn delay={0.6} y={30} className="md:pointer-events-auto">
          <Magnet padding={150} strength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out">
            <div className="relative">
              {/* soft glow separates dark hair from the dark page */}
              <div
                aria-hidden="true"
                className="absolute inset-[8%_4%_14%] -z-10 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(closest-side, rgba(182,0,168,.35), rgba(118,33,176,.18) 55%, transparent 75%)' }}
              />
              <motion.img
                src={avatar}
                alt="Валерія, засновниця EMBR"
                width={848}
                height={1200}
                draggable={false}
                className="relative mx-auto block h-[min(60svh,600px)] w-auto select-none md:h-[min(calc(88svh-40px),1000px)]"
                animate={reduce ? undefined : { y: [0, -16, 0], rotate: [0, -1.2, 0, 1.2, 0] }}
                transition={{ y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: 8.4, repeat: Infinity, ease: 'easeInOut' } }}
              />
              {/* floor shadow shrinks as the figure rises */}
              <motion.div
                aria-hidden="true"
                className="mx-auto mt-2 h-3 w-[50%] rounded-[50%] bg-black/80 blur-md"
                animate={reduce ? undefined : { scaleX: [1, 0.8, 1], opacity: [0.8, 0.45, 0.8] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 flex flex-col items-center gap-5 px-6 pb-7 pt-4 text-center sm:gap-6 sm:pb-8 md:mt-auto md:flex-row md:items-end md:justify-between md:px-10 md:pb-10 md:text-left">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[640px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] md:max-w-[300px] lg:max-w-[360px]"
          style={{ fontSize: 'clamp(1rem, 1.9vw, 1.6rem)' }}
        >
          Створю ШІ-рішення для вашого бізнесу: сайти, ШІ-адміністратори та відео, які приводять клієнтів
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
