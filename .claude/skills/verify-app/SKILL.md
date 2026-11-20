---
name: verify-app
description: Launch, drive and screenshot Vaishnavi Tikke's portfolio (Next.js single page) to prove a change works. Use after any change under app/, components/ or lib/.
---

# verify-app

Single page `/`, no backend, no env vars. Playwright is a **verification tool only**: install it outside the repo (never add it to `package.json`).

## Launch (clean checkout)
```bash
npm install && npm run build
npx next start -p 3111 > /tmp/portfolio-next.log 2>&1 &   # note the PID: PID=$!
# ready = usable: / serves the hero h1
until curl -fs localhost:3111 | grep -q '<h1[^>]*>.*Vaishnavi.*Tikke'; do sleep 1; done
```
Use `npm run dev` for iteration; verify against `build` + `start`.

## Doctor (read-only)
`node -v` (≥20), `ls node_modules/.bin/next`, `curl -fsI localhost:3111/`, `curl -fs localhost:3111/robots.txt`, `curl -fsI localhost:3111/opengraph-image`. Fails ⇒ fix the environment, don't edit code.

## Drive
One-time tool setup: `mkdir -p /tmp/pw && cd /tmp/pw && npm i playwright && npx playwright install chromium` (may need `sudo npx playwright install-deps chromium`).
Then: `node .claude/skills/verify-app/scripts/drive.mjs http://localhost:3111 evidence` (run with `NODE_PATH=/tmp/pw/node_modules` or copy script next to the install). It drives the real selectors:
- nav: `.nav-desktop a` (`#work #experience #about #contact`), `.connect`, `.wordmark`
- mobile: `.menu-btn` (aria-expanded), `#mobile-menu a`, Esc closes + focus returns
- hero: `.btns a` (→ `#work`, `#contact`), `.proof`
- work: `.entry .textlink` (4 hrefs, `target=_blank`, `rel` has noopener noreferrer)
- contact: `.contact-list a` (3 hrefs)
Feature detail lives in `features/*.md`.

## Evidence
For every run capture: the action, resulting state, side effects (none expected: no requests besides the page's own assets — check no failed requests, no console errors/warnings). Screenshots into `evidence/` (git-ignored): hero + full page at 390, 768, 1440; hero also at 1280×720. Also report `scrollWidth == innerWidth` (no horizontal scroll) at 360–1920 and computed `font-family` of `h1` (must start with Instrument Serif, never Times New Roman).

## Cleanup
Kill only the PID you started (`kill $PID`); never `pkill next`. Keep `evidence/`.

## Feature map
- [hero](features/hero.md)
- [nav, smooth scroll, mobile menu](features/nav.md)
- [work gallery + links](features/work.md)
- [experience / about / bring](features/sections.md)
- [contact + links](features/contact.md)
