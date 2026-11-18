import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Instagram, Send } from 'lucide-react'
import { TELEGRAM } from './Buttons'

const SOCIALS = [
  { icon: Send, label: 'Telegram', href: TELEGRAM },
  { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/khami_val/' },
]

const EASE = [0.76, 0, 0.24, 1] as const

export type MenuLink = { label: string; href: string; className?: string }

function Burger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
      <button
        type="button"
        aria-label={open ? 'Закрити меню' : 'Відкрити меню'}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={onClick}
        className="relative -mr-2.5 -mt-2 flex h-12 w-12 items-center justify-center transition-opacity duration-200 hover:opacity-60 active:scale-95"
      >
        <span className="relative block h-3.5 w-7" aria-hidden="true">
          <span className={`absolute left-0 h-0.5 w-7 rounded bg-[#0C0C0C] transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-7 rounded bg-[#0C0C0C] transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`absolute left-0 h-0.5 w-7 rounded bg-[#0C0C0C] transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
        </span>
      </button>
  )
}

/** Burger button + full-screen white menu; links rise in one by one. */
export default function Menu({ links }: { links: MenuLink[] }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', onKey); document.documentElement.style.overflow = '' }
  }, [open])

  return (
    <>
      <Burger open={false} onClick={() => setOpen(true)} />

      {createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="fixed inset-0 z-[90] flex flex-col justify-between bg-white px-5 pb-8 pt-28 text-[#0C0C0C] sm:px-8 md:px-14"
            initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'circle(150% at calc(100% - 3rem) 3rem)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at calc(100% - 3rem) 3rem)' }}
            transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
          >
            <div className="absolute right-5 top-5 sm:right-8 md:right-14 md:top-7">
              <Burger open onClick={() => setOpen(false)} />
            </div>
            <nav aria-label="Розділи" className="flex flex-col gap-2">
              {links.map((l, i) => (
                <span key={l.href} className={`overflow-hidden ${l.className ?? ''}`}>
                  <motion.a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="hero-heading inline-block font-black uppercase leading-[1.05] tracking-tight transition-opacity hover:opacity-60"
                    style={{ fontSize: 'clamp(3rem, 11vw, 8rem)' }}
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 + i * 0.08, ease: EASE }}
                  >
                    {l.label}
                  </motion.a>
                </span>
              ))}
              <motion.ul
                className="mt-8 flex flex-col gap-3 sm:mt-10"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 + links.length * 0.08 + 0.1, ease: EASE }}
              >
                {SOCIALS.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} target="_blank" rel="noopener" className="inline-flex items-center gap-3 text-lg font-light tracking-wide text-[#0C0C0C]/75 transition-opacity hover:opacity-60 sm:text-xl">
                      <c.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                      {c.label} <span className="text-[#0C0C0C]/60">@khami_val</span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </nav>
            <motion.div
              className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6 text-sm uppercase tracking-widest text-[#0C0C0C]/60"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                Беру нові проєкти
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </>
  )
}
