import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Brief from '../../src/sections/Brief'

describe('Brief form', () => {
  it('shows errors and does not open Telegram when required fields are empty', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<Brief />)
    await userEvent.click(screen.getByRole('button', { name: /надіслати бриф/i }))
    expect(screen.getByText("Вкажіть ім'я")).toBeInTheDocument()
    expect(screen.getByText(/Вкажіть Telegram або телефон/)).toBeInTheDocument()
    expect(open).not.toHaveBeenCalled()
  })

  it('opens Telegram with the filled brief and shows the thank-you state', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<Brief />)
    await userEvent.type(screen.getByLabelText(/Ваше ім'я/), 'Олена')
    await userEvent.type(screen.getByLabelText(/Telegram або телефон/), '@olena')
    await userEvent.click(screen.getByRole('checkbox', { name: 'Сайт' }))
    await userEvent.click(screen.getByRole('button', { name: /надіслати бриф/i }))

    expect(open).toHaveBeenCalledOnce()
    const url = decodeURIComponent(String(open.mock.calls[0][0]))
    expect(url).toMatch(/^https:\/\/t\.me\/khami_val\?text=/)
    expect(url).toContain("Ім'я: Олена")
    expect(url).toContain('Потрібно: Сайт')
    expect(url).not.toContain('Бюджет')
    expect(screen.queryByRole('radio')).toBeNull()
    expect(screen.getByText('Дякую!')).toBeInTheDocument()
  })

  it('chips toggle aria-checked', async () => {
    render(<Brief />)
    const chip = screen.getByRole('checkbox', { name: 'Рекламне відео' })
    expect(chip).toHaveAttribute('aria-checked', 'false')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-checked', 'true')
  })
})
