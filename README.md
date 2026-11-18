# EMBR — сайт Валерії (khami_val)

Vite + React + TypeScript + Tailwind + Framer Motion.

## Команди

| Команда | Що робить |
|---|---|
| `npm run dev` | локальний сервер розробки |
| `npm run build` | продакшн-збірка в `dist/` (це деплоїть Vercel) |
| `npm run build:preview` | один HTML-файл у `dist-preview/` для превʼю |
| `npm run typecheck` | перевірка типів TypeScript |
| `npm test` | unit-тести (Vitest): логіка брифу, контент, форма, заставка |
| `npm run test:e2e` | E2E-тести (Playwright) на десктопі й мобільному |
| `npm run test:perf` | Lighthouse CI: performance ≥ 90, a11y ≥ 90, SEO ≥ 90, CLS ≤ 0.05, TBT ≤ 200 ms |
| `npm run test:all` | усе разом |

## CI/CD

- **CI** — `.github/workflows/ci.yml`: на кожен push у `main` і кожен PR запускає типи + unit → E2E і Lighthouse паралельно.
- **CD** — Vercel Git-інтеграція: `main` → продакшн (`*.vercel.app`), кожен PR → окреме preview-посилання.
- Щоб у продакшн не потрапляло зламане: у GitHub → Settings → Branches → правило для `main` з обовʼязковими перевірками CI, зміни лише через PR.
