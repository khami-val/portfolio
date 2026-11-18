import FadeIn from '../components/FadeIn'
import RevealHeading from '../components/RevealHeading'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'

const text =
  'Створю для Вашого бізнесу сайт, ШІ-адміністратора. Ваш бізнес не втрачатиме заробіток на записах, бо Ваших клієнтів запише ШІ-адміністратор навіть у 21:04.'

export default function About() {
  return (
    <section id="about" className="relative hidden flex-col md:flex items-center justify-center overflow-hidden px-5 py-28 sm:px-8 sm:py-36 md:px-10 md:py-44">
      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <RevealHeading text="Про мене" className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }} />
          <AnimatedText
            text={text}
            className="max-w-[560px] text-center font-medium leading-relaxed text-[#0C0C0C]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>
        <ContactButton />
      </div>
    </section>
  )
}
