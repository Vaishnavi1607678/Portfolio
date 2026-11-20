"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { JUMP_EVENT, jumpTo, requestJump } from "@/lib/scroll";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import s from "./Header.module.css";

const NAV = [
  { n: "01", label: "Work", id: "work" },
  { n: "02", label: "Field notes", id: "field-notes" },
  { n: "03", label: "Growth Lab", id: "growth-lab" },
  { n: "04", label: "Fredrin", id: "fredrin" },
];
const MENU = [...NAV, { n: "05", label: "About", id: "about" }, { n: "06", label: "Approach", id: "approach" }, { n: "07", label: "Contact", id: "contact" }];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [wipe, setWipe] = useState<"idle" | "in" | "out">("idle");
  const bar = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  // scroll progress
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  // wipe transition on jump requests
  useEffect(() => {
    const onJump = (e: Event) => {
      const id = (e as CustomEvent<{ id: string }>).detail.id;
      if (busy.current) return;
      if (prefersReducedMotion()) { jumpTo(id); return; }
      busy.current = true;
      setWipe("in");
      setTimeout(() => {
        jumpTo(id);
        setWipe("out");
        setTimeout(() => { setWipe("idle"); busy.current = false; }, 450);
      }, 450);
    };
    window.addEventListener(JUMP_EVENT, onJump);
    return () => window.removeEventListener(JUMP_EVENT, onJump);
  }, []);

  const closeMenu = useCallback((restore = true) => {
    setOpen(false);
    if (restore) menuBtn.current?.focus();
  }, []);

  // menu: Esc, focus trap, scroll lock, inert background
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () => Array.from(menu.current?.querySelectorAll<HTMLElement>("a, button") ?? []);
    links()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeMenu(); return; }
      if (e.key !== "Tab") return;
      const l = links();
      const first = l[0], last = l[l.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, closeMenu]);

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    if (open) closeMenu(false);
    requestJump(id);
  };

  return (
    <>
      <header className={s.header}>
        <div className={s.row}>
          <a className={s.mark} href="#hero" onClick={go("hero")} aria-label="VT/26 — back to top">VT/26</a>
          <nav className={s.nav} aria-label="Primary">
            {NAV.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)}><i>{l.n}</i>{l.label}</a>
            ))}
          </nav>
          <span className={s.snap}><u aria-hidden="true" />Figures: snapshot, not a live feed</span>
          <button ref={menuBtn} className={s.menuBtn} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            MENU <span aria-hidden="true">+</span>
          </button>
        </div>
        <div className={s.progress} aria-hidden="true"><div ref={bar} className={s.bar} /></div>
      </header>

      <div id="mobile-menu" ref={menu} className={s.menu} data-open={open || undefined} role="dialog" aria-modal="true" aria-label="Menu" hidden={!open}>
        <button className={s.close} onClick={() => closeMenu()}>CLOSE <span aria-hidden="true">×</span></button>
        <ul>
          {MENU.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} onClick={go(l.id)}><i>{l.n}</i>{l.label}</a></li>
          ))}
        </ul>
        <p className="label">Figures: snapshot, not a live feed</p>
      </div>

      <div className={s.wipe} data-state={wipe} aria-hidden="true"><span>VT/26</span></div>
    </>
  );
}
