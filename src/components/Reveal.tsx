import { motion } from "framer-motion";
import { useAnimationReducedMotion } from "@/hooks/use-animation-reduced-motion";
import type { ReactNode } from "react";

export function Reveal({ children, className, delay = 0, x = 0 }: {
  children: ReactNode; className?: string; delay?: number; x?: number;
}) {
  const reducedMotion = useAnimationReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: x ? 0 : 16, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}