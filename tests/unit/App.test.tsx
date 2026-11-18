import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../../src/App'

describe('App intro', () => {
  it('shows the loader first, then the site after it is skipped', async () => {
    render(<App />)
    expect(screen.getByRole('status', { name: /Завантаження/ })).toBeInTheDocument()
    expect(document.querySelector('main')).toBeNull()
    fireEvent.click(screen.getByRole('status'))
    await waitFor(() => expect(document.querySelector('main')).not.toBeNull(), { timeout: 3000 })
    expect(sessionStorage.getItem('embr-intro-seen')).toBe('1')
  })

  it('skips the loader when it was already seen this session', () => {
    sessionStorage.setItem('embr-intro-seen', '1')
    render(<App />)
    expect(screen.queryByRole('status', { name: /Завантаження/ })).toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Привіт, я Лера')
  })
})
