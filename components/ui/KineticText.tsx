"use client";
import { useEffect, useState, type CSSProperties } from "react";
import s from "./KineticText.module.css";

type Props = {
  text: string;
  by?: "letter" | "word";
  stagger?: number;
  delay?: number;
  className?: string;
  /** sessionStorage key: when already set, the entrance is skipped (once per visit). */
  onceKey?: string;
};

/** Splits text into spans for staggered entrance/hover. Full text sits in an aria-label; pieces are aria-hidden.
 *  Text is fully visible until hydration, so it stays readable without JS. */
export default function KineticText({ text, by = "letter", stagger = 40, delay = 0, className = "", onceKey }: Props) {
  const [state, setState] = useState<"ssr" | "armed" | "on">("ssr");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = onceKey ? sessionStorage.getItem(onceKey) : null;
    if (reduce || seen) return;
    let r2 = 0, r3 = 0;
    const r1 = requestAnimationFrame(() => {
      setState("armed");
      r2 = requestAnimationFrame(() => { r3 = requestAnimationFrame(() => setState("on")); });
    });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); cancelAnimationFrame(r3); };
  }, [onceKey]);
  const parts = by === "word" ? text.split(" ") : Array.from(text);
  return (
    <span className={`${s.k} ${className}`} data-state={state} role="text" aria-label={text}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true" className={s.p} style={{ "--i": i, "--st": `${stagger}ms`, "--dl": `${delay}ms` } as CSSProperties}>
          {p === " " ? " " : p}
          {by === "word" && i < parts.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
