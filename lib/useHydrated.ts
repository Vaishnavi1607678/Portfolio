"use client";
import { useSyncExternalStore } from "react";
const noop = () => () => {};
/** false during SSR/hydration, true afterwards — lets "hidden until revealed" styles apply only when JS runs. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
