# Vaishnavi Tikke — portfolio

An experimental editorial portfolio (ink / paper / acid-lime / cobalt) for Vaishnavi Tikke's Founding Growth Lead application at Fredrin. Next.js App Router + TypeScript, hand-written CSS, no animation/scroll/3D libraries, no database, no env vars.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

- `app/globals.css` — design tokens (CSS custom properties), reset, grain overlay
- `components/sections/` — one component (+ CSS module) per section, in page order
- `components/ui/`, `lib/` — shared primitives: `Reveal`, `Counter`, `KineticText`, `Cursor`, `Header`, `useReducedMotion`, `useInView`

## Deploy

Deployed on Fredrin's Vercel app: a preview per branch, production on merge. No configuration or environment variables required.
