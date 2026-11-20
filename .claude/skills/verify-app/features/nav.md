# Nav, smooth scroll, mobile menu
- Header sticky, solid ivory, 1px hairline, compacts after 24px scroll.
- Scrolling to a section sets `aria-current="location"` on its `.nav-link`.
- ≤800px: `.menu-btn` opens `#mobile-menu` (full screen), body scroll locked, Tab cycles inside, Esc closes and refocuses the button, link click closes.
- Skip link `.skip-link` is first tab stop and targets `#main`.
