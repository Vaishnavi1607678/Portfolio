// Usage: NODE_PATH=/tmp/pw/node_modules node drive.mjs <baseUrl> <outDir>
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_PATH ?? "/tmp/pw/node_modules/playwright");
const [, , base = "http://localhost:3111", out = "evidence"] = process.argv;
mkdirSync(out, { recursive: true });
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails++; };
const b = await chromium.launch();
const bad = [];
const watch = (p) => { p.on("console", (m) => ["error", "warning"].includes(m.type()) && bad.push(m.text())); p.on("pageerror", (e) => bad.push(String(e))); p.on("requestfailed", (r) => bad.push("reqfail " + r.url())); };
const sweep = async (p) => { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { scrollTo({ top: y, behavior: "instant" }); await new Promise((r) => setTimeout(r, 100)); } scrollTo({ top: 0, behavior: "instant" }); }); await p.waitForTimeout(600); };

// ---- links
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); watch(p);
  await p.goto(base);
  ok((await p.locator("h1").count()) === 1 && (await p.locator("h1").innerText()).replace(/\s+/g, " ").trim() === "Vaishnavi Tikke", "exactly one h1 'Vaishnavi Tikke'");
  const work = await p.$$eval(".entry .textlink", (a) => a.map((x) => [x.href, x.target, x.rel, x.textContent]));
  const want = ["2043604310496530550", "2041869776927261024", "2043624154646409708", "2106690704244420687"];
  ok(work.length === 4 && work.every((w, i) => w[0] === `https://x.com/_vmlops/status/${want[i]}` && w[1] === "_blank" && /noopener/.test(w[2]) && /noreferrer/.test(w[2])), "4 work links: href/target/rel");
  const contact = await p.$$eval(".contact-list a", (a) => a.map((x) => [x.href, x.target, x.rel]));
  ok(JSON.stringify(contact.map((c) => c[0])) === JSON.stringify(["https://linkedin.com/in/vaishnavi-tikke", "https://github.com/Vaishnavi1607678", "https://x.com/_vmlops"]) && contact.every((c) => c[1] === "_blank" && /noopener noreferrer/.test(c[2])), "3 contact links: href/target/rel");
  for (const id of ["work", "experience", "about", "bring", "contact"]) ok((await p.locator(`section#${id}`).count()) === 1, `anchor target #${id} exists`);
  for (const sel of [".nav-desktop a", ".btns a", ".connect"]) for (const h of await p.$$eval(sel, (a) => a.map((x) => x.getAttribute("href")))) ok(await p.locator(`[id="${h.slice(1)}"]`).count() === 1, `${sel} → ${h} resolves`);
  // nav + active state
  await p.click('.nav-desktop a[href="#about"]'); await p.waitForTimeout(1500);
  ok((await p.getAttribute('.nav-desktop a[href="#about"]', "aria-current")) === "location", "nav marks About active after click");
  ok((await p.evaluate(() => document.getElementById("about").getBoundingClientRect().top)) < 200, "smooth scroll landed on #about under sticky header");
  // keyboard: first tab = skip link
  await p.goto(base); await p.keyboard.press("Tab");
  ok(await p.evaluate(() => document.activeElement.classList.contains("skip-link")), "first Tab focuses skip link");
  // computed fonts + styling bans
  const f = await p.evaluate(() => ({ h1: getComputedStyle(document.querySelector("h1")).fontFamily, body: getComputedStyle(document.body).fontFamily, bad: [...document.querySelectorAll("*")].filter((e) => { const s = getComputedStyle(e); return s.boxShadow !== "none" || s.backgroundImage !== "none" || parseFloat(s.borderTopLeftRadius) > 0; }).length }));
  ok(!/times/i.test(f.h1 + f.body) && /^"?Instrument Serif/.test(f.h1), `fonts: ${f.h1.slice(0, 40)}…`);
  ok(f.bad === 0, "no gradients / shadows / rounded corners in computed styles");
  await p.close();
}
// ---- viewports
for (const [w, h] of [[360, 780], [390, 844], [768, 1024], [1024, 768], [1440, 900], [1920, 1080], [1280, 720]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } }); watch(p);
  await p.goto(base); await p.waitForTimeout(1200);
  const m = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, pb: document.querySelector(".proof").getBoundingClientRect().bottom, ih: innerHeight }));
  ok(m.sw <= m.iw, `${w}×${h} no horizontal scroll (${m.sw}/${m.iw})`);
  if (w >= 1280 && w <= 1440) ok(m.pb <= m.ih, `${w}×${h} proof strip inside first viewport (${Math.round(m.pb)}≤${m.ih})`);
  if ([390, 768, 1440, 1280].includes(w)) await p.screenshot({ path: `${out}/hero-${w}.png` });
  if ([390, 768, 1440].includes(w)) { await sweep(p); await p.screenshot({ path: `${out}/full-${w}.png`, fullPage: true }); }
  await p.close();
}
// ---- mobile menu
{
  const p = await b.newPage({ viewport: { width: 390, height: 844 } }); watch(p);
  await p.goto(base);
  await p.click(".menu-btn");
  ok((await p.getAttribute(".menu-btn", "aria-expanded")) === "true" && (await p.isVisible("#mobile-menu")), "Menu opens overlay");
  ok((await p.evaluate(() => document.body.style.overflow)) === "hidden", "body scroll locked");
  await p.screenshot({ path: `${out}/menu-390.png` });
  const seen = new Set(); for (let i = 0; i < 8; i++) { await p.keyboard.press("Tab"); seen.add(await p.evaluate(() => document.activeElement.className + document.activeElement.textContent)); }
  ok(await p.evaluate(() => document.getElementById("mobile-menu").contains(document.activeElement) || document.activeElement.classList.contains("menu-btn")), "focus trapped within overlay + Menu button");
  await p.keyboard.press("Escape");
  ok(!(await p.isVisible("#mobile-menu")) && (await p.evaluate(() => document.activeElement.classList.contains("menu-btn"))), "Esc closes and restores focus to Menu");
  await p.click(".menu-btn"); await p.click('#mobile-menu a[href="#work"]'); await p.waitForTimeout(1200);
  ok(!(await p.isVisible("#mobile-menu")) && (await p.evaluate(() => document.getElementById("work").getBoundingClientRect().top)) < 150, "overlay link closes + scrolls to #work");
  await p.close();
}
// ---- reduced motion
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }); const p = await c.newPage();
  await p.goto(base); await p.waitForTimeout(300);
  const r = await p.evaluate(() => ({ sb: getComputedStyle(document.documentElement).scrollBehavior, hidden: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length, anim: getComputedStyle(document.querySelector(".hero-name .line")).animationName }));
  ok(r.sb === "auto" && r.hidden === 0 && r.anim === "none", `reduced motion: instant scroll, content visible, no animation`);
  await c.close();
}
ok(bad.length === 0, `no console errors/warnings or failed requests ${bad.length ? JSON.stringify(bad) : ""}`);
await b.close();
console.log(fails ? `${fails} FAILED` : "ALL PASSED");
process.exit(fails ? 1 : 0);
