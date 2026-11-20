"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import s from "./SignalGraph.module.css";

type Kind = "tech" | "dist" | "people";
type N = { k: Kind; x: number; y: number; r: number };

// Home positions in the 640x700 viewBox (from the approved mockup).
const NODES: N[] = [
  { k: "tech", x: 330, y: 210, r: 7 }, { k: "tech", x: 250, y: 400, r: 7 }, { k: "tech", x: 120, y: 120, r: 7 },
  { k: "dist", x: 420, y: 300, r: 10 }, { k: "dist", x: 220, y: 270, r: 10 }, { k: "dist", x: 560, y: 330, r: 10 },
  { k: "people", x: 520, y: 150, r: 5 }, { k: "people", x: 90, y: 330, r: 5 }, { k: "people", x: 460, y: 470, r: 5 },
  { k: "people", x: 180, y: 560, r: 5 }, { k: "people", x: 400, y: 620, r: 5 }, { k: "people", x: 560, y: 440, r: 3 },
  { k: "people", x: 470, y: 210, r: 3 }, { k: "people", x: 30, y: 450, r: 3 }, { k: "people", x: 330, y: 520, r: 3 },
];
const EDGES: [number, number][] = [
  [2, 0], [0, 6], [0, 1], [1, 8], [2, 7], [7, 1], [6, 5], [5, 8], [7, 9], [9, 1], [8, 10], [10, 9], [0, 5], [1, 10],
  [0, 3], [3, 8], [2, 4], [4, 1], [3, 12], [5, 11], [7, 13], [1, 14], [3, 5],
];
const ADJ: number[][] = NODES.map(() => []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });
const TECH = [0, 1, 2];
const ROUTE_STATIC = [0, 3, 8];

function pickRoute(from: number, rnd: () => number): number[] {
  const dists = ADJ[from].filter((n) => NODES[n].k === "dist");
  const d = dists.length ? dists[Math.floor(rnd() * dists.length)] : ADJ[from][0];
  const ppl = ADJ[d].filter((n) => NODES[n].k === "people");
  const p = ppl.length ? ppl[Math.floor(rnd() * ppl.length)] : ADJ[d][0];
  return [from, d, p];
}

export default function SignalGraph() {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const host = root.current, el = svg.current;
    if (!host || !el) return;
    const reduce = prefersReducedMotion();
    const pos = NODES.map((n) => ({ x: n.x, y: n.y, vx: 0, vy: 0 }));
    const lit = NODES.map(() => -1e9); // time (ms) at which node is lit
    const ph = NODES.map((_, i) => i * 1.7);
    const nodeEls = Array.from(el.querySelectorAll<SVGGElement>("[data-n]"));
    const haloEls = Array.from(el.querySelectorAll<SVGCircleElement>("[data-h]"));
    const lineEls = Array.from(el.querySelectorAll<SVGLineElement>("[data-e]"));
    const routeEl = el.querySelector<SVGPolylineElement>("[data-route]")!;
    const dotEl = el.querySelector<SVGCircleElement>("[data-dot]")!;
    let route = ROUTE_STATIC.slice();
    let sig: { route: number[]; t0: number } | null = null;
    let nextAuto = 1800;
    let pointer: { x: number; y: number } | null = null;
    let drag: { i: number; moved: boolean; sx: number; sy: number } | null = null;
    let visible = true, raf = 0, last = 0, now = 0;
    const rnd = Math.random;

    const toSvg = (cx: number, cy: number) => {
      const b = el.getBoundingClientRect();
      return { x: ((cx - b.left) / b.width) * 640, y: ((cy - b.top) / b.height) * 700 };
    };

    const burstFrom = (i: number) => {
      const dist = new Map<number, number>([[i, 0]]);
      const q = [i];
      while (q.length) { const c = q.shift()!; ADJ[c].forEach((n) => { if (!dist.has(n)) { dist.set(n, dist.get(c)! + 1); q.push(n); } }); }
      dist.forEach((h, n) => { lit[n] = now + h * 240; });
      if (reduce) draw();
    };
    const fire = (from?: number) => {
      const f = from ?? TECH[Math.floor(rnd() * TECH.length)];
      route = pickRoute(f, rnd);
      if (reduce) { route.forEach((n) => (lit[n] = now)); draw(); return; }
      sig = { route, t0: now };
    };

    const draw = () => {
      NODES.forEach((n, i) => {
        const p = pos[i];
        const g = lit[i] <= now ? Math.max(0, 1 - (now - lit[i]) / 900) : 0;
        nodeEls[i].setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(1 + g * 0.7).toFixed(2)})`);
        const h = haloEls[i];
        h.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        h.setAttribute("r", String(n.r + 6 + (1 - g) * 14));
        h.style.opacity = String(g);
      });
      EDGES.forEach(([a, b], i) => {
        const l = lineEls[i];
        l.setAttribute("x1", pos[a].x.toFixed(1)); l.setAttribute("y1", pos[a].y.toFixed(1));
        l.setAttribute("x2", pos[b].x.toFixed(1)); l.setAttribute("y2", pos[b].y.toFixed(1));
      });
      const rt = sig ? sig.route : route;
      routeEl.setAttribute("points", rt.map((n) => `${pos[n].x.toFixed(1)},${pos[n].y.toFixed(1)}`).join(" "));
      if (sig) {
        const seg = (now - sig.t0) / 900; // 900ms per hop
        const i = Math.min(Math.floor(seg), sig.route.length - 2);
        const f = Math.min(1, seg - i);
        const a = pos[sig.route[i]], b = pos[sig.route[i + 1]];
        dotEl.setAttribute("cx", String(a.x + (b.x - a.x) * f)); dotEl.setAttribute("cy", String(a.y + (b.y - a.y) * f));
        dotEl.style.opacity = "1";
        sig.route.forEach((n, k) => { if (seg >= k && lit[n] < sig!.t0 + k * 900 - 1) lit[n] = sig!.t0 + k * 900; });
        if (seg >= sig.route.length - 1 + 0.3) { sig = null; dotEl.style.opacity = "0"; }
      } else dotEl.style.opacity = "0";
    };

    const step = (dt: number) => {
      const t = now / 1000;
      pos.forEach((p, i) => {
        if (drag && drag.i === i) return;
        const h = NODES[i];
        const dx = h.x + Math.sin(t * 0.6 + ph[i]) * 7, dy = h.y + Math.cos(t * 0.5 + ph[i] * 1.3) * 7;
        let ax = (dx - p.x) * 14, ay = (dy - p.y) * 14;
        if (pointer) {
          const ex = p.x - pointer.x, ey = p.y - pointer.y, d = Math.hypot(ex, ey) || 1;
          if (d < 170) {
            // repel up close, gently attract at the edge of the field
            const f = d < 80 ? (80 - d) * 22 : -(d - 80) * 2.2;
            ax += (ex / d) * f; ay += (ey / d) * f;
          }
        }
        p.vx = (p.vx + ax * dt) * Math.pow(0.02, dt); p.vy = (p.vy + ay * dt) * Math.pow(0.02, dt);
        p.x += p.vx * dt; p.y += p.vy * dt;
      });
    };

    const frame = (ts: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, last ? (ts - last) / 1000 : 0.016);
      last = ts; now = ts;
      step(dt);
      if (!sig && now > nextAuto) { fire(); nextAuto = now + 4200; }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!reduce && !raf && visible) { last = 0; raf = requestAnimationFrame(frame); } };

    // pointer: nodes are draggable; page-level pointer attracts/repels
    const onNodeDown = (e: PointerEvent) => {
      const g = (e.target as Element).closest<SVGGElement>("[data-n]");
      if (!g) return;
      const i = Number(g.dataset.n);
      e.preventDefault();
      g.setPointerCapture(e.pointerId);
      drag = { i, moved: false, sx: e.clientX, sy: e.clientY };
    };
    const onNodeMove = (e: PointerEvent) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 5) drag.moved = true;
      if (drag.moved) {
        const p = toSvg(e.clientX, e.clientY);
        pos[drag.i].x = Math.max(0, Math.min(640, p.x)); pos[drag.i].y = Math.max(0, Math.min(700, p.y));
        pos[drag.i].vx = pos[drag.i].vy = 0;
        if (reduce) draw();
      }
    };
    const onNodeUp = () => {
      if (!drag) return;
      const d = drag; drag = null;
      if (!d.moved) { if (NODES[d.i].k === "tech") { burstFrom(d.i); fire(d.i); } else burstFrom(d.i); }
      else if (reduce) { pos[d.i].x = NODES[d.i].x; pos[d.i].y = NODES[d.i].y; draw(); }
    };
    const onHeroMove = (e: PointerEvent) => { if (e.pointerType === "mouse") pointer = toSvg(e.clientX, e.clientY); };
    const onHeroLeave = () => { pointer = null; };
    const hero = host.closest("section") ?? host;
    hero.addEventListener("pointermove", onHeroMove as EventListener, { passive: true });
    hero.addEventListener("pointerleave", onHeroLeave);
    el.addEventListener("pointerdown", onNodeDown as EventListener);
    el.addEventListener("pointermove", onNodeMove as EventListener);
    el.addEventListener("pointerup", onNodeUp);
    el.addEventListener("pointercancel", onNodeUp);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const f = TECH[Math.floor(rnd() * TECH.length)]; burstFrom(f); fire(f); start(); }
    };
    host.addEventListener("keydown", onKey);

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) start(); }, { threshold: 0 });
    io.observe(host);
    draw();
    if (!reduce) start();
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      hero.removeEventListener("pointermove", onHeroMove as EventListener);
      hero.removeEventListener("pointerleave", onHeroLeave);
      host.removeEventListener("keydown", onKey);
      el.removeEventListener("pointerdown", onNodeDown as EventListener);
      el.removeEventListener("pointermove", onNodeMove as EventListener);
      el.removeEventListener("pointerup", onNodeUp);
      el.removeEventListener("pointercancel", onNodeUp);
    };
  }, []);

  return (
    <div
      ref={root}
      className={s.graph}
      role="button"
      tabIndex={0}
      aria-label="Signal graph: technology, distribution and people. Press Enter or Space to send a signal."
      aria-describedby="signal-graph-help"
    >
      <p id="signal-graph-help" className="vh">
        An illustrative network. Lime squares are technology, cobalt discs are distribution, small paper dots are people. Press Enter or Space to send a signal from technology through distribution to people. With a pointer, drag a node, or click a lime square to send a burst.
      </p>
      <svg ref={svg} className={s.svg} viewBox="0 0 640 700" fill="none" aria-hidden="true" focusable="false">
        <g stroke="#efeadc" strokeOpacity=".28" strokeWidth="1">
          {EDGES.map(([a, b], i) => <line key={i} data-e={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />)}
        </g>
        <polyline data-route points="" stroke="#c8ff00" strokeWidth="2" strokeDasharray="5 6" strokeOpacity=".9" strokeLinejoin="round" />
        {NODES.map((n, i) => <circle key={i} data-h={i} r={n.r + 20} stroke="#c8ff00" strokeWidth="1.5" style={{ opacity: 0 }} />)}
        {NODES.map((n, i) => (
          <g key={i} data-n={i} className={s.node} transform={`translate(${n.x} ${n.y})`}>
            <circle r="20" fill="transparent" />
            {n.k === "tech" && <rect x={-n.r} y={-n.r} width={n.r * 2} height={n.r * 2} fill="#c8ff00" />}
            {n.k === "dist" && <circle r={n.r} fill="#1f3cff" />}
            {n.k === "people" && <circle r={n.r} fill="#efeadc" />}
          </g>
        ))}
        <circle data-dot r="5" fill="#c8ff00" style={{ opacity: 0 }} />
      </svg>
    </div>
  );
}
