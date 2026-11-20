"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/content";

const IDS = ["work", "experience", "about", "bring", "contact"];

export default function Header() {
  const [active, setActive] = useState<string>("");
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const close = useCallback((restore = true) => {
    setOpen(false);
    if (restore) menuBtn.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      Array.from(overlay.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const f = [menuBtn.current!, ...focusables()];
      const first = f[0];
      const last = f[f.length - 1];
      const cur = document.activeElement;
      if (e.shiftKey && cur === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && cur === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const mq = window.matchMedia("(min-width: 801px)");
    const onMq = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <header className={`site-header${compact ? " is-compact" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <a className="wordmark" href="#top" aria-label="Vaishnavi Tikke — back to top">
        Vaishnavi Tikke
      </a>
      <nav className="nav-desktop" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className="nav-link" aria-current={active === n.id ? "location" : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="connect" href="#contact">
        <i className="marker" aria-hidden="true" />
        Let&rsquo;s connect <span aria-hidden="true">↗</span>
      </a>
      <button
        ref={menuBtn}
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? "Close" : "Menu"}
      </button>
      <div id="mobile-menu" ref={overlay} className="menu-overlay" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a key={n.id} href={`#${n.id}`} onClick={() => close(false)}>
              <span className="menu-idx">0{i + 2}</span>
              {n.label}
            </a>
          ))}
          <a href="#contact" className="menu-connect" onClick={() => close(false)}>
            <i className="marker" aria-hidden="true" />
            Let&rsquo;s connect <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
