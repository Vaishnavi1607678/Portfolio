"use client";
import { type CSSProperties, type ElementType, type ReactNode } from "react";
import { useInView } from "@/lib/useInView";
import { useHydrated } from "@/lib/useHydrated";
import s from "./Reveal.module.css";

type Props = {
  children: ReactNode;
  variant?: "up" | "left" | "clip" | "fade";
  delay?: number;
  as?: ElementType;
  className?: string;
};

/** Reveals on first intersection. Content is visible without JS (the hidden state is applied only after mount). */
export default function Reveal({ children, variant = "up", delay = 0, as: Tag = "div", className = "" }: Props) {
  const { ref, inView } = useInView<HTMLElement>({ once: true, threshold: 0.12 });
  const armed = useHydrated();
  const style = { "--d": `${delay}ms` } as CSSProperties;
  return (
    <Tag ref={ref} style={style} data-armed={armed || undefined} data-in={inView || undefined} className={`${s.r} ${s[variant]} ${className}`}>
      {children}
    </Tag>
  );
}
