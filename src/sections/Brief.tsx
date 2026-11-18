import { useState, type FormEvent, type ReactNode } from 'react'
import { Check, Send } from 'lucide-react'
import FadeIn from '../components/FadeIn'
import RevealHeading from '../components/RevealHeading'
import { TELEGRAM } from '../components/Buttons'
import { NEEDS, buildBriefMessage, telegramLink, validateBrief, type BriefFields, type BriefErrors } from '../lib/brief'

const EMAIL = 'khamidullinavaleriia@gmail.com'

type Fields = BriefFields

/** Text input / textarea whose label floats above once focused or filled. */
function Field({ id, label, value, onChange, required, textarea, error, autoComplete }: {
  id: keyof Fields; label: string; value: string; onChange: (v: string) => void
  required?: boolean; textarea?: boolean; error?: string; autoComplete?: string
}) {
  const cls =
    'peer block w-full rounded-2xl border bg-white px-5 pb-3 pt-7 text-base text-[#0C0C0C] outline-none transition-colors placeholder:text-transparent focus:border-[#B600A8] focus:bg-white ' +
    (error ? 'border-[#D1174A]' : 'border-[#0C0C0C]/15 hover:border-[#0C0C0C]/30')
  const common = {
    id: `brief-${id}`, name: id, value, placeholder: label, required, autoComplete,
    'aria-invalid': !!error || undefined, 'aria-describedby': error ? `brief-${id}-err` : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className: cls,
  }
  return (
    <div className="relative">
      {textarea ? <textarea rows={4} {...common} className={cls + ' resize-none'} /> : <input type="text" {...common} />}
      <label
        htmlFor={`brief-${id}`}
        className="pointer-events-none absolute left-5 top-2.5 text-xs font-light uppercase tracking-widest text-[#0C0C0C]/60 transition-all duration-200 peer-placeholder-shown:top-[1.15rem] peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2.5 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#B600A8]"
      >
        {label}{required && ' *'}
      </label>
      {error && <p id={`brief-${id}-err`} className="mt-2 pl-5 text-sm text-[#D1174A]">{error}</p>}
    </div>
  )
}

function Chip({ on, onClick, children, role }: { on: boolean; onClick: () => void; children: ReactNode; role: 'checkbox' | 'radio' }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={on}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-all duration-200 ${
        on ? 'border-transparent bg-[#B600A8] text-white shadow-[0_6px_16px_-4px_rgba(182,0,168,.45)]' : 'border-[#0C0C0C]/20 text-[#0C0C0C]/80 hover:border-[#0C0C0C]/50'
      }`}
    >
      {on && <Check className="h-4 w-4" aria-hidden="true" />}
      {children}
    </button>
  )
}

export default function Brief() {
  const [f, setF] = useState<Fields>({ name: '', contact: '', business: '', message: '' })
  const [needs, setNeeds] = useState<string[]>([])
  const [errors, setErrors] = useState<BriefErrors>({})
  const [sent, setSent] = useState<{ msg: string; via: 'bot' | 'manual' } | null>(null)
  const [sending, setSending] = useState(false)
  const [website, setWebsite] = useState('')
  const set = (k: keyof Fields) => (v: string) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })) }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    const err = validateBrief(f)
    setErrors(err)
    if (Object.keys(err).length) { document.getElementById(`brief-${Object.keys(err)[0]}`)?.focus(); return }
    const msg = buildBriefMessage(f, needs)
    setSending(true)
    let ok = false
    try {
      const r = await fetch('/api/brief', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...f, needs, website }) })
      ok = r.ok
    } catch { /* offline or no server: fall back to Telegram */ }
    setSending(false)
    if (!ok) navigator.clipboard?.writeText(msg).catch(() => {})
    setSent({ msg, via: ok ? 'bot' : 'manual' })
  }

  return (
    <section id="brief" className="relative z-[25] -mt-10 rounded-t-[40px] bg-[#F4F4F5] px-5 pb-28 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pb-32 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pb-40 md:pt-32">
      <RevealHeading text="Бриф" className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }} />
      <FadeIn as="p" delay={0.1} className="mx-auto mt-8 max-w-xl text-center font-light text-[#0C0C0C]/80" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>
        Розкажіть про бізнес за 1 хвилину. Відповім протягом 15 хвилин з ідеями та орієнтовною ціною.
      </FadeIn>

      <FadeIn delay={0.15} className="mx-auto mt-14 max-w-3xl">
        {sent ? (
          <div role="status" className="flex flex-col items-center gap-5 rounded-[32px] border border-[#0C0C0C]/15 p-8 text-center text-[#0C0C0C] sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B600A8] shadow-[0_0_24px_rgba(182,0,168,.5)]">
              <Check className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-medium uppercase">{sent.via === 'bot' ? 'Заявку отримано!' : 'Майже готово'}</h3>
            <p className="max-w-md font-light text-[#0C0C0C]/70">
              {sent.via === 'bot'
                ? 'Дякую! Відповім протягом 15 хвилин у вказаний контакт.'
                : 'Не вдалося надіслати автоматично. Натисніть кнопку нижче: Telegram відкриється з готовим текстом, залишиться натиснути «Надіслати». Текст також скопійовано.'}
            </p>
            {sent.via === 'manual' && <div className="flex flex-wrap justify-center gap-3">
              <a href={telegramLink(TELEGRAM, sent.msg)} target="_blank" rel="noopener" className="rounded-full border-2 border-[#0C0C0C] px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#0C0C0C]/10">
                Відкрити Telegram
              </a>
              <a href={`mailto:${EMAIL}?subject=${encodeURIComponent('Бриф з сайту khami.studio')}&body=${encodeURIComponent(sent.msg)}`} className="rounded-full border-2 border-[#0C0C0C]/30 px-6 py-3 text-sm font-medium uppercase tracking-widest hover:bg-[#0C0C0C]/10">
                Надіслати на email
              </a>
            </div>}
          </div>
        ) : (
          <form noValidate onSubmit={submit} aria-busy={sending} className="flex flex-col gap-4">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={(e) => setWebsite(e.target.value)} className="absolute -left-[9999px] h-px w-px opacity-0" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Ваше ім'я" value={f.name} onChange={set('name')} required error={errors.name} autoComplete="name" />
              <Field id="contact" label="Telegram або телефон" value={f.contact} onChange={set('contact')} required error={errors.contact} autoComplete="tel" />
            </div>
            <Field id="business" label="Бізнес і місто, напр. салон краси, Київ" value={f.business} onChange={set('business')} autoComplete="organization" />

            <fieldset className="mb-4 mt-4">
              <legend className="mb-3 pl-1 text-xs font-light uppercase tracking-widest text-[#0C0C0C]/60">Що потрібно</legend>
              <div className="flex flex-wrap gap-2">
                {NEEDS.map((n) => (
                  <Chip key={n} role="checkbox" on={needs.includes(n)} onClick={() => setNeeds((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]))}>{n}</Chip>
                ))}
              </div>
            </fieldset>

            <Field id="message" label="Розкажіть про задачу" value={f.message} onChange={set('message')} textarea />

            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className="flex disabled:opacity-70 items-center gap-3 rounded-full px-10 py-4 text-sm font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] md:text-base"
                style={{
                  background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                  boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                  outline: '2px solid #fff', outlineOffset: '-3px',
                }}
              >
                <Send className={`h-4 w-4 ${sending ? 'animate-pulse' : ''}`} aria-hidden="true" />
                {sending ? 'Надсилаю…' : 'Надіслати бриф'}
              </button>
              <p className="max-w-md text-center text-xs font-light text-[#0C0C0C]/60">
                Заявка приходить мені в Telegram, на сайті нічого не зберігається. Надсилаючи, ви погоджуєтесь з політикою конфіденційності.
              </p>
            </div>
          </form>
        )}
      </FadeIn>
    </section>
  )
}
