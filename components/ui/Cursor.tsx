"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import s from "./Cursor.module.css";

const INTERACTIVE = "a, button, [role=button], summary, [data-cursor]";
const TEXTY = "input, textarea, select, [contenteditable=true]";

/** Fine-pointer custom cursor: lime dot + eased ring. `data-cursor="VIEW"` on any element shows a label. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    document.documentElement.dataset.cursor = "on";
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, running = false;
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      if (Math.abs(x - rx) + Math.abs(y - ry) > 0.1) raf = requestAnimationFrame(loop); else running = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (!running) { running = true; raf = requestAnimationFrame(loop); }
      const t = e.target as Element | null;
      const texty = !!t?.closest(TEXTY);
      const cur = t?.closest<HTMLElement>("[data-cursor]");
      const hot = !!t?.closest(INTERACTIVE);
      const r = ring.current!;
      r.dataset.hot = hot ? "1" : "";
      r.dataset.hide = texty ? "1" : "";
      if (dot.current) dot.current.dataset.hide = texty ? "1" : "";
      document.documentElement.dataset.cursor = texty ? "native" : "on";
      if (label.current) label.current.textContent = cur?.dataset.cursor ?? "";
      r.dataset.label = cur?.dataset.cursor ? "1" : "";
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); delete document.documentElement.dataset.cursor; };
  }, []);
  return (
    <>
      <div ref={ring} className={s.ring} aria-hidden="true"><span ref={label} className={s.label} /></div>
      <div ref={dot} className={s.dot} aria-hidden="true" />
    </>
  );
}
