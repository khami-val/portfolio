import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  sessionStorage.clear()
})

// jsdom has no matchMedia / IntersectionObserver; framer-motion and the preloader need them
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (q: string) => ({ matches: false, media: q, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }),
})
class IO {
  observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn(); takeRecords = () => []
}
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IO })
Object.defineProperty(window, 'scrollTo', { writable: true, value: vi.fn() })
