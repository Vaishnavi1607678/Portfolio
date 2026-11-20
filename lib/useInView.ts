"use client";
import { useEffect, useRef, useState } from "react";

/** Observe an element; `once` keeps it true after first intersection. */
export function useInView<T extends Element>(opts: { once?: boolean; rootMargin?: string; threshold?: number } = {}) {
  const { once = false, rootMargin = "0px", threshold = 0.15 } = opts;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); }
        else if (!once) setInView(false);
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);
  return { ref, inView };
}
