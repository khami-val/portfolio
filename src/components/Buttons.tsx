import type { ReactNode } from 'react'

export const TELEGRAM = 'https://t.me/khami_val'

export function ContactButton({ label = 'Написати', href = TELEGRAM }: { label?: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="inline-block rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid #fff',
        outlineOffset: '-3px',
      }}
    >
      {label}
    </a>
  )
}

export function LiveProjectButton({ href, label = 'Дивитися сайт' }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="inline-block whitespace-nowrap rounded-full border-2 border-[#0C0C0C] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest text-[#0C0C0C] transition-colors duration-200 hover:bg-[#0C0C0C]/10"
    >
      {label}
    </a>
  )
}
