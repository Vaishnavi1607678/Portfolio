"use client";
import { useEffect, useRef } from "react";
import Counter from "@/components/ui/Counter";
import KineticText from "@/components/ui/KineticText";
import { requestJump } from "@/lib/scroll";
import SignalGraph from "./SignalGraph";
import s from "./Hero.module.css";

const ONCE = "vt-intro";

export default function Hero() {
  const sec = useRef<HTMLElement>(null);

  useEffect(() => {
    // child effects have already read the flag; mark the intro as seen for this visit
    sessionStorage.setItem(ONCE, "1");
    const el = sec.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const b = el.getBoundingClientRect();
        el.style.setProperty("--px", String(((e.clientX - b.left) / b.width - 0.5) * 2));
        el.style.setProperty("--py", String(((e.clientY - b.top) / b.height - 0.5) * 2));
      });
    };
    el.addEventListener("pointermove", move, { passive: true });
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="hero" ref={sec} className={s.hero} aria-labelledby="hero-title">
      <div className={s.stage}>
        <p className={`${s.tag} label`} aria-hidden="true">(Tech) → (Distribution) → (People)</p>
        <div className={s.netBox}>
          <div className={s.netLayer}><SignalGraph /></div>
        </div>

        <h1 id="hero-title" className={s.h1} tabIndex={-1}>
          <span className="vh">I make tech impossible to ignore.</span>
          <span className={s.typeLayer} aria-hidden="true">
            <span className={`${s.t} ${s.a}`}><KineticText text="I MAKE" onceKey={ONCE} stagger={55} /></span>
            <span className={`${s.t} ${s.b}`}><KineticText text="tech" onceKey={ONCE} stagger={90} delay={250} /></span>
            <span className={`${s.t} ${s.c}`}><KineticText text="IMPOSSIBLE" onceKey={ONCE} stagger={45} delay={500} /></span>
            <span className={`${s.t} ${s.d}`}>
              <KineticText text="TO " onceKey={ONCE} stagger={55} delay={900} />
              <span className={s.block}><KineticText text="IGNORE." onceKey={ONCE} stagger={50} delay={1000} /></span>
            </span>
          </span>
        </h1>

        <div className={s.sticker}>
          <b><Counter to={22} suffix="K+" /></b>
          <span>AUDIENCE</span>
        </div>
        <div className={`${s.tape} ${s.t1}`}>
          <b><Counter to={1} suffix="M+" /></b>highest post views
        </div>
        <div className={`${s.tape} ${s.t2}`}>AI × Developer Tools</div>
        <div className={`${s.tape} ${s.t3}`}>FDE × GTM × Growth</div>
        <p className={`${s.snapCap} label`}>Snapshot of figures from her posts — not a live feed.</p>

        <div className={s.name}>
          <p className={s.nameH}>Vaishnavi Tikke</p>
          <p className={`${s.role} label`}>Developer GTM · Forward Deployed Engineer</p>
        </div>

        <a className={s.scroll} href="#work" onClick={(e) => { e.preventDefault(); requestJump("work"); }}>
          <span className="label">Drag the graph · scroll for proof</span>
          <b>THE WORK ↓</b>
        </a>
      </div>
    </section>
  );
}
