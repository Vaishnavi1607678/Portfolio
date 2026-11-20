# Vaishnavi Tikke — portfolio

A single-page, editorial personal-brand site: warm ivory, oversized Instrument Serif type, Manrope for body and labels, one restrained navy accent. Built with Next.js (App Router, TypeScript) and hand-written CSS — no Tailwind, UI kits or animation libraries, no database, no env vars.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
npx tsc --noEmit
```

## Structure

- `app/` — layout, page, `globals.css` (design tokens), `sections.css`, OG image, icon, robots, sitemap
- `components/sections/` — one component per section; `components/ui/` — shared bits
- `lib/content.ts` — all copy; `lib/site.ts` — absolute site URL
- `.claude/skills/verify-app/` — launch/drive/screenshot verification skill (Playwright lives outside the app's dependencies)

## Deploy (Vercel)

Import the repo in Vercel (framework: Next.js, defaults are fine). Every branch gets a preview URL and merges to `main` go to production. No environment variables are needed: `metadataBase` is derived from Vercel's built-in `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL`. Fonts are self-hosted at build time via `next/font`.
