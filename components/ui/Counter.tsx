"use client";
import { useEffect, useState } from "react";
import { useInView } from "@/lib/useInView";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Props = { to: number; suffix?: string; prefix?: string; duration?: number; className?: string };

/** Counts up once when visible. SSR renders the final value, so no-JS and reduced motion show it instantly. */
export default function Counter({ to, suffix = "", prefix = "", duration = 1400, className }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>({ once: true, threshold: 0.3 });
  const [val, setVal] = useState<number | null>(null);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) return; // final value is already shown
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className}>
      <span className="vh">{prefix}{to}{suffix}</span>
      <span aria-hidden="true">{prefix}{val ?? to}{suffix}</span>
    </span>
  );
}
