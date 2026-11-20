---
name: verify-app
description: Launch, drive and screenshot the portfolio (Next.js) to prove a change works. Use after changing any section, nav or motion.
---

# verify-app

## Launch
From a clean checkout: `npm install && npm run build && npm run start -- -p 3100` (or `npm run dev`). Ready means usable: `curl -s localhost:3100/ | grep -c '<h1'` is ≥1 and the HTML contains every section id (`hero work field-notes growth-lab about approach fredrin contact`).

## Doctor (read-only)
`curl -s -o /dev/null -w '%{http_code}' localhost:3100/` → 200; `npm run lint`; `npx tsc --noEmit`. Never writes.

## Drive
Playwright lives OUTSIDE the app (e.g. `/tmp/pw`: `npm i playwright && npx playwright install chromium && npx playwright install-deps chromium`). Selectors: `nav[aria-label=Primary] a` (nav), `button[aria-controls=mobile-menu]` (MENU +), `#mobile-menu`, `[aria-describedby=signal-graph-help]` (graph; Enter/Space fires a signal), `svg [data-n="0"]` (tech node, draggable), `section#<id>`. Watch `console`/`pageerror` for errors.

## Evidence
Per feature record: the action, the resulting state (hash, scrollY, `document.activeElement`, `scrollWidth`), side effects (none: no network writes), and screenshots at 390, 768 and 1440 (also 360 / 1920 for the hero, and `reducedMotion: "reduce"`). Keep them in `.verify/` (git-ignored).

## Cleanup
Kill only the server you started (note its PID). Keep `.verify/` evidence.

## Feature map
- `features/hero-graph.md` — hero type, creator-metric objects, signal graph
- `features/nav-transitions.md` — header, scroll progress, MENU, wipe transition, cursor
- work gallery, growth lab, fredrin/contact — to be added by their tickets
