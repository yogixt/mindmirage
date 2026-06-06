"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger delay in seconds — pass index * 0.08 for grids. */
  delay?: number;
  className?: string;
};

/**
 * Scroll-reveal wrapper — fades and rises content the first time it
 * enters the viewport. Used to give cards a gentle entrance.
 */
export default function Reveal({ children, delay = 0, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
