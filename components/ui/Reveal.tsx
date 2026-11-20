"use client";

import { useEffect } from "react";

/**
 * Scroll reveals, once. Elements already in view stay untouched; those below the
 * fold are hidden then faded in on entry. Content is fully visible with no JS
 * or with prefers-reduced-motion.
 */
export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
    if (!below.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    below.forEach((el) => {
      el.classList.add("reveal-pending");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
