import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '../../api/brief'
import { sanitizeBrief } from '../../src/lib/brief'

const req = (body: unknown) => new Request('http://x/api/brief', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) })
const good = { name: 'Олена', contact: '@olena', business: 'Салон, Київ', message: 'Хочу бота', needs: ['Сайт', 'evil'], website: '' }

describe('sanitizeBrief', () => {
  it('keeps known needs, trims and caps fields', () => {
    const r = sanitizeBrief({ ...good, name: '  ' + 'а'.repeat(500) })!
    expect(r.fields.name.length).toBe(120)
    expect(r.needs).toEqual(['Сайт'])
    expect(r.bot).toBe(false)
  })
  it('rejects non-objects and flags the honeypot', () => {
    expect(sanitizeBrief(null)).toBeNull()
    expect(sanitizeBrief({ ...good, website: 'http://spam' })!.bot).toBe(true)
  })
})

describe('POST /api/brief', () => {
  const fetchMock = vi.fn()
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('process', { env: { TELEGRAM_BOT_TOKEN: 'T', TELEGRAM_CHAT_ID: '42' } })
    fetchMock.mockReset().mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('sends the brief to the configured chat', async () => {
    const r = await POST(req(good))
    expect(r.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.telegram.org/botT/sendMessage')
    const body = JSON.parse(init.body)
    expect(body.chat_id).toBe('42')
    expect(body.text).toContain("Ім'я: Олена")
    expect(body.text).toContain('Потрібно: Сайт')
    expect(body.text).not.toContain('evil')
  })
  it('validates input', async () => {
    expect((await POST(req('not json'))).status).toBe(400)
    expect((await POST(req({ ...good, name: '' }))).status).toBe(422)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('silently drops honeypot spam', async () => {
    expect((await POST(req({ ...good, website: 'x' }))).status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('reports missing config and Telegram errors', async () => {
    vi.stubGlobal('process', { env: {} })
    expect((await POST(req(good))).status).toBe(503)
    vi.stubGlobal('process', { env: { TELEGRAM_BOT_TOKEN: 'T', TELEGRAM_CHAT_ID: '42' } })
    fetchMock.mockResolvedValue(new Response('{}', { status: 400 }))
    expect((await POST(req(good))).status).toBe(502)
  })
})
