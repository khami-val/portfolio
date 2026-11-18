import { describe, expect, it } from 'vitest'
import { marquee, plans, projects, services } from '../../src/data'
import { TELEGRAM } from '../../src/components/Buttons'

describe('content', () => {
  it('has the agreed prices', () => {
    expect(plans.map((p) => p.price)).toEqual(['15 000', '30 000', '4 500'])
  })
  it('every plan has at least 3 bullet points', () => {
    plans.forEach((p) => expect(p.items.length).toBeGreaterThanOrEqual(3))
  })
  it('project links are https', () => {
    projects.forEach((p) => expect(p.href).toMatch(/^https:\/\//))
  })
  it('all images have alt text', () => {
    marquee.forEach((m) => expect(m.alt.trim()).not.toBe(''))
    projects.forEach((p) => { expect(p.desktop).toBeTruthy(); expect(p.mobile).toBeTruthy(); expect(p.href).toContain(p.domain) })
  })
  it('services are listed', () => {
    expect(services.length).toBeGreaterThanOrEqual(4)
  })
  it('Telegram points to @khami_val', () => {
    expect(TELEGRAM).toBe('https://t.me/khami_val')
  })
})
