import { expect, test, type Page } from '@playwright/test'

const skipIntro = async (page: Page) => {
  await page.addInitScript(() => sessionStorage.setItem('embr-intro-seen', '1'))
}

test('intro loader plays once, then the site opens', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await expect(page.getByRole('status', { name: /Завантаження/ })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Привіт, я Лера', { timeout: 6000 })
  await page.reload()
  await expect(page.getByRole('status', { name: /Завантаження/ })).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(errors).toEqual([])
})

test('clicking the loader skips it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('status').click()
  await expect(page.locator('main')).toBeVisible({ timeout: 2000 })
})

test('burger menu opens, links lead to sections, Esc closes', async ({ page }) => {
  await skipIntro(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Відкрити меню' }).click()
  const menu = page.getByRole('dialog', { name: 'Меню' })
  await expect(menu).toBeVisible()
  for (const id of ['projects', 'brief', 'contact']) {
    await expect(menu.locator(`a[href="#${id}"]`)).toBeVisible()
    await expect(page.locator(`#${id}`)).toHaveCount(1)
  }
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await page.getByRole('button', { name: 'Відкрити меню' }).click()
  await menu.locator('a[href="#projects"]').click()
  await expect(menu).toHaveCount(0)
  await expect(page.locator('#projects h2')).toBeInViewport()
  await expect(page.locator('#prices')).toHaveCount(0)
})

test('about is hidden on phones, shown on desktop', async ({ page, isMobile }) => {
  await skipIntro(page)
  await page.goto('/')
  if (isMobile) await expect(page.locator('#about')).toBeHidden()
  else await expect(page.locator('#about')).toBeVisible()
})

test('all sections render and every Telegram link is @khami_val', async ({ page }) => {
  await skipIntro(page)
  await page.goto('/')
  for (const id of ['about', 'projects', 'brief', 'contact']) await expect(page.locator(`#${id}`)).toBeAttached()
  const tg = await page.locator('a[href*="t.me/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))
  expect(tg.length).toBeGreaterThan(2)
  tg.forEach((h) => expect(h).toMatch(/^https:\/\/t\.me\/khami_val/))
  await expect(page.locator('footer').getByText('by khami.studio')).toBeAttached()
})

test('brief form validates and delivers through /api/brief', async ({ page }) => {
  let posted: Record<string, unknown> | null = null
  await page.route('**/api/brief', async (r) => { posted = r.request().postDataJSON(); await r.fulfill({ status: 200, json: { ok: true } }) })
  await skipIntro(page)
  await page.goto('/#brief')
  const send = page.getByRole('button', { name: /надіслати бриф/i })
  await send.scrollIntoViewIfNeeded()
  await send.click()
  await expect(page.getByText("Вкажіть ім'я")).toBeVisible()

  await page.getByLabel(/Ваше ім'я/).fill('Олена')
  await page.getByLabel(/Telegram або телефон/).fill('@olena')
  await page.getByRole('checkbox', { name: 'ШІ-адміністратор' }).click()
  await send.click()
  await expect(page.getByText('Заявку отримано!')).toBeVisible()
  expect(posted).toMatchObject({ name: 'Олена', contact: '@olena', needs: ['ШІ-адміністратор'] })
})

test('brief falls back to Telegram when the server is down', async ({ page }) => {
  await page.route('**/api/brief', (r) => r.fulfill({ status: 503, json: { ok: false } }))
  await skipIntro(page)
  await page.goto('/#brief')
  await page.getByLabel(/Ваше ім'я/).fill('Олена')
  await page.getByLabel(/Telegram або телефон/).fill('@olena')
  await page.getByRole('button', { name: /надіслати бриф/i }).click()
  const tg = page.getByRole('link', { name: /Відкрити Telegram/ })
  await expect(tg).toBeVisible()
  expect(decodeURIComponent((await tg.getAttribute('href')) ?? '')).toContain("t.me/khami_val?text=Привіт! Заявка з сайту")
})

test('no horizontal scroll and no broken images', async ({ page }) => {
  await skipIntro(page)
  await page.goto('/')
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
  })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const broken = await page.locator('img').evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).map((i) => (i as HTMLImageElement).src))
  expect(broken).toEqual([])
})
