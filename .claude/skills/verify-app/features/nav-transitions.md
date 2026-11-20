# Nav + transitions
- Click a header link → cobalt wipe, then `location.hash` updates, section scrolled to top, focus lands on the section heading (`tabindex=-1`).
- Mobile (390, touch): `MENU +` opens `#mobile-menu` (focus moves inside, Tab cycles, Esc closes, focus returns to MENU). Menu link jumps to the section.
- Scroll progress: lime bar under the header grows with scroll.
- Cursor: dot + ring on fine pointers only; `html[data-cursor]` is undefined on touch and under reduced motion. `data-cursor="VIEW"` on an element shows a label.
