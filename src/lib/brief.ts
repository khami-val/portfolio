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
    'Привіт! Заявка з сайту EMBR',
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
