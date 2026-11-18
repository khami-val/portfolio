import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Brief from '../../src/sections/Brief'

describe('Brief form', () => {
  afterEach(() => vi.restoreAllMocks())

  const fill = async () => {
    await userEvent.type(screen.getByLabelText(/Ваше ім'я/), 'Олена')
    await userEvent.type(screen.getByLabelText(/Telegram або телефон/), '@olena')
    await userEvent.click(screen.getByRole('checkbox', { name: 'Сайт' }))
    await userEvent.click(screen.getByRole('button', { name: /надіслати бриф/i }))
  }

  it('shows errors and sends nothing when required fields are empty', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    render(<Brief />)
    await userEvent.click(screen.getByRole('button', { name: /надіслати бриф/i }))
    expect(screen.getByText("Вкажіть ім'я")).toBeInTheDocument()
    expect(screen.getByText(/Вкажіть Telegram або телефон/)).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('posts the brief to /api/brief and confirms delivery', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}', { status: 200 }))
    render(<Brief />)
    await fill()
    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/brief')
    const body = JSON.parse(String((init as RequestInit).body))
    expect(body).toMatchObject({ name: 'Олена', contact: '@olena', needs: ['Сайт'], website: '' })
    expect(await screen.findByText('Заявку отримано!')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Відкрити Telegram/ })).toBeNull()
  })

  it('falls back to a prefilled Telegram link when the server fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 503 }))
    render(<Brief />)
    await fill()
    expect(await screen.findByText('Майже готово')).toBeInTheDocument()
    const href = decodeURIComponent(screen.getByRole('link', { name: /Відкрити Telegram/ }).getAttribute('href') ?? '')
    expect(href).toMatch(/^https:\/\/t\.me\/khami_val\?text=/)
    expect(href).toContain("Ім'я: Олена")
    expect(href).toContain('Потрібно: Сайт')
  })

  it('chips toggle aria-checked', async () => {
    render(<Brief />)
    const chip = screen.getByRole('checkbox', { name: 'Рекламне відео' })
    expect(chip).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-checked', 'true')
  })
})
