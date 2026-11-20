/** Section ids in page order. */
export const SECTIONS = ["hero", "work", "field-notes", "growth-lab", "about", "approach", "fredrin", "contact"] as const;

/** Window event used by nav links to request a wipe-transition jump. */
export const JUMP_EVENT = "vt:jump";

export function requestJump(id: string) {
  window.dispatchEvent(new CustomEvent(JUMP_EVENT, { detail: { id } }));
}

/** Move to a section: scroll instantly, focus its heading/section (tabindex=-1), update the hash. */
export function jumpTo(id: string, behavior: ScrollBehavior = "auto") {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior, block: "start" });
  const target = el.querySelector<HTMLElement>("h1, h2") ?? el;
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}
