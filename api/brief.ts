import { buildBriefMessage, sanitizeBrief, validateBrief } from '../src/lib/brief'

declare const process: { env: Record<string, string | undefined> }

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } })

/**
 * Vercel function: POST /api/brief -> message to Valeriia's Telegram bot.
 * Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel → Settings → Environment Variables.
 */
export async function POST(req: Request): Promise<Response> {
  let body: unknown
  try { body = await req.json() } catch { return json(400, { ok: false, error: 'bad_json' }) }
  const data = sanitizeBrief(body)
  if (!data) return json(400, { ok: false, error: 'bad_body' })
  if (data.bot) return json(200, { ok: true }) // pretend success, drop spam
  if (Object.keys(validateBrief(data.fields)).length) return json(422, { ok: false, error: 'invalid' })

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return json(503, { ok: false, error: 'not_configured' })

  const text = '🔥 Нова заявка з khami.studio\n\n' + buildBriefMessage(data.fields, data.needs).split('\n').slice(1).join('\n')
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    })
    if (!r.ok) return json(502, { ok: false, error: 'telegram' })
  } catch {
    return json(502, { ok: false, error: 'telegram' })
  }
  return json(200, { ok: true })
}
