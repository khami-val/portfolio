import { describe, expect, it } from 'vitest'
import { buildBriefMessage, telegramLink, validateBrief } from '../../src/lib/brief'

const empty = { name: '', contact: '', business: '', message: '' }

describe('validateBrief', () => {
  it('requires name and contact', () => {
    expect(validateBrief(empty)).toEqual({ name: expect.any(String), contact: expect.any(String) })
  })
  it('ignores whitespace-only input', () => {
    expect(Object.keys(validateBrief({ ...empty, name: '   ', contact: '    ' }))).toEqual(['name', 'contact'])
  })
  it('passes with a name and a Telegram handle', () => {
    expect(validateBrief({ ...empty, name: 'Олена', contact: '@olena' })).toEqual({})
  })
})

describe('buildBriefMessage', () => {
  it('includes only the filled fields', () => {
    const msg = buildBriefMessage({ ...empty, name: ' Олена ', contact: '@olena' }, [])
    expect(msg).toBe("Привіт! Заявка з сайту khami.studio\nІм'я: Олена\nКонтакт: @olena")
  })
  it('lists needs and task', () => {
    const msg = buildBriefMessage({ name: 'Олена', contact: '@olena', business: 'Салон, Київ', message: 'Хочу бота' }, ['Сайт', 'ШІ-адміністратор'])
    expect(msg).toContain('Бізнес: Салон, Київ')
    expect(msg).toContain('Потрібно: Сайт, ШІ-адміністратор')
    expect(msg).not.toContain('Бюджет')
    expect(msg).toContain('Задача: Хочу бота')
  })
})

describe('telegramLink', () => {
  it('url-encodes the text', () => {
    expect(telegramLink('https://t.me/khami_val', 'a b\nв')).toBe('https://t.me/khami_val?text=a%20b%0A%D0%B2')
  })
})
