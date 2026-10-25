import { animate, useInView } from "framer-motion";
import { useAnimationReducedMotion } from "@/hooks/use-animation-reduced-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useAnimationReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const controls = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setValue });
    return () => controls.stop();
  }, [inView, to, reducedMotion]);
  return <span ref={ref} className="tabular-nums" aria-label={`${to.toFixed(decimals)}${suffix}`}><span aria-hidden="true">{(reducedMotion ? to : value).toFixed(decimals)}{suffix}</span></span>;
}