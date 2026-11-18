import { Check } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import { plans } from '../data'
import { TELEGRAM } from '../components/Buttons'

export default function Prices() {
  return (
    <section id="prices" className="relative z-20 -mt-10 rounded-t-[40px] bg-white px-5 py-20 sm:-mt-12 md:-mt-14 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn as="h2" y={40} className="mb-6 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
        Ціни
      </FadeIn>
      <FadeIn as="p" delay={0.1} className="mx-auto mb-14 max-w-xl text-center font-light text-[#0C0C0C]/60 sm:mb-20" style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.2rem)' }}>
        Фіксована сума в договорі. Сайт і ШІ-бот окремо: ціна після консультації.
      </FadeIn>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <FadeIn
            key={p.name}
            delay={i * 0.1}
            className={`flex flex-col gap-6 rounded-[32px] p-7 sm:p-8 ${p.hot ? 'bg-[#0C0C0C] text-[#D7E2EA]' : 'border-2 border-[#0C0C0C]/10 text-[#0C0C0C]'}`}
          >
            <div>
              <div className={`text-xs font-medium uppercase tracking-widest ${p.hot ? 'text-[#D7E2EA]/70' : 'text-[#0C0C0C]/50'}`}>{p.tag}</div>
              <h3 className="mt-2 text-xl font-medium uppercase">{p.name}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`font-black leading-none ${p.hot ? 'hero-heading' : ''}`} style={{ fontSize: 'clamp(2.6rem, 4.5vw, 3.6rem)' }}>
                {p.price}
              </span>
              <span className="font-light opacity-60">{p.unit}</span>
            </div>
            <ul className="flex flex-col gap-3 font-light">
              {p.items.map((it) => (
                <li key={it} className="flex gap-3">
                  <Check className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener"
              className={`mt-auto rounded-full border-2 px-6 py-3 text-center text-sm font-medium uppercase tracking-widest transition-colors ${p.hot ? 'border-[#D7E2EA] hover:bg-[#D7E2EA]/10' : 'border-[#0C0C0C] hover:bg-[#0C0C0C]/5'}`}
            >
              Обрати
            </a>
          </FadeIn>
        ))}
      </div>
      <FadeIn as="p" delay={0.2} className="mx-auto mt-8 max-w-3xl text-center font-light text-[#0C0C0C]/70">
        <b className="font-medium text-[#0C0C0C]">Гарантія строку.</b> Не запустили за 14 робочих днів після отримання прайсу й доступів — перші 2 місяці супроводу безкоштовно.
      </FadeIn>
    </section>
  )
}
