export type BriefFields = { name: string; contact: string; business: string; message: string }
export type BriefErrors = Partial<Record<keyof BriefFields, string>>

/** Required: a name (2+ chars) and a way to reply (4+ chars). */
export function validateBrief(f: BriefFields): BriefErrors {
  const err: BriefErrors = {}
  if (f.name.trim().length < 2) err.name = "Вкажіть ім'я"
  if (f.contact.trim().length < 4) err.contact = 'Вкажіть Telegram або телефон, щоб я могла відповісти'
  return err
}

/** Plain-text message sent to Telegram / email. Empty optional fields are left out. */
export function buildBriefMessage(f: BriefFields, needs: string[]): string {
  return [
    'Привіт! Заявка з сайту khami.studio',
    `Ім'я: ${f.name.trim()}`,
    `Контакт: ${f.contact.trim()}`,
    f.business.trim() && `Бізнес: ${f.business.trim()}`,
    needs.length > 0 && `Потрібно: ${needs.join(', ')}`,
    f.message.trim() && `Задача: ${f.message.trim()}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export function telegramLink(base: string, text: string): string {
  return `${base}?text=${encodeURIComponent(text)}`
}

export const NEEDS = ['Сайт', 'ШІ-адміністратор', 'Рекламне відео', 'Під ключ'] as const
const LIMITS: Record<keyof BriefFields, number> = { name: 120, contact: 120, business: 200, message: 2000 }

/** Server-side guard for /api/brief: keeps only known fields, trims and caps their length. */
export function sanitizeBrief(body: unknown): { fields: BriefFields; needs: string[]; bot: boolean } | null {
  if (!body || typeof body !== 'object') return null
  const b = body as Record<string, unknown>
  const str = (k: keyof BriefFields) => (typeof b[k] === 'string' ? (b[k] as string).trim().slice(0, LIMITS[k]) : '')
  const fields: BriefFields = { name: str('name'), contact: str('contact'), business: str('business'), message: str('message') }
  const needs = Array.isArray(b.needs) ? b.needs.filter((n): n is string => (NEEDS as readonly string[]).includes(n as string)) : []
  // hidden "website" field: people never fill it, spam bots usually do
  const bot = typeof b.website === 'string' && b.website.length > 0
  return { fields, needs, bot }
}
