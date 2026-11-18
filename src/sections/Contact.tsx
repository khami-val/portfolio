import { Send, Instagram, Mail } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import RevealHeading from '../components/RevealHeading'
import { ContactButton, TELEGRAM } from '../components/Buttons'

const channels = [
  { icon: Send, label: 'Telegram', value: '@khami_val', href: TELEGRAM },
  { icon: Instagram, label: 'Instagram', value: '@khami_val', href: 'https://www.instagram.com/khami_val/' },
  { icon: Mail, label: 'Email', value: 'khamidullinavaleriia@gmail.com', href: 'mailto:khamidullinavaleriia@gmail.com' },
]

export default function Contact() {
  return (
    <section id="contact" className="relative z-30 -mt-10 rounded-t-[40px] bg-white px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <RevealHeading text="Контакт" className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }} />
      <FadeIn as="p" delay={0.1} className="mx-auto mt-8 max-w-xl text-center font-light text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>
        Почнемо з безкоштовного тесту: я напишу вам як клієнтка ввечері й покажу, де губляться записи.
      </FadeIn>
      <div className="mx-auto mt-14 flex max-w-3xl flex-col">
        {channels.map((c, i) => (
          <FadeIn key={c.label} delay={0.1 + i * 0.1}>
            <a
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener"
              className="group flex items-center justify-between gap-4 border-t border-[#0C0C0C]/15 py-6 text-[#0C0C0C] transition-opacity hover:opacity-70"
            >
              <span className="flex items-center gap-4 text-sm font-light uppercase tracking-widest">
                <c.icon className="h-5 w-5" aria-hidden="true" />
                {c.label}
              </span>
              <span className="break-all text-right font-medium" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.5rem)' }}>
                {c.value}
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <ContactButton label="Написати в Telegram" />
      </div>
      <footer className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-[#0C0C0C]/15 py-8 text-sm font-light text-[#0C0C0C]/60">
        <span>© 2026 khami.studio · Політика конфіденційності</span>
        <span className="font-medium text-[#0C0C0C]"><span className="font-light text-[#0C0C0C]/60">by</span> khami.studio</span>
      </footer>
    </section>
  )
}
