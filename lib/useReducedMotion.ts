"use client";
import { useSyncExternalStore } from "react";

const Q = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(Q);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
/** True when the user prefers reduced motion. Server snapshot is false; CSS also gates motion. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(Q).matches, () => false);
}
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(Q).matches;
}
