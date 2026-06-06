"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Node = { deva?: string; en: string; subtitle?: string };

const NODES: Node[] = [
  { deva: "श्री आदि शङ्कराचार्य", en: "Adi Shankarācārya", subtitle: "Source of the lineage" },
  { en: "Paramparā", subtitle: "The unbroken line of teachers" },
  { en: "Acharya Bhagyashree Joshi Ji", subtitle: "Mind Mirage · Rishikesh" },
  { en: "The Sādhak", subtitle: "You" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LineageTree() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-4">
      {/* ──────────  Desktop / tablet: horizontal timeline  ────────── */}
      <div className="relative hidden md:block py-5">
        {/* The thread */}
        <div className="relative h-3">
          <motion.div
            aria-hidden
            className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(201,162,39,0.7) 10%, rgba(201,162,39,0.7) 90%, transparent 100%)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE }}
          />

          {/* Dots aligned with cards below */}
          <div className="absolute inset-0 grid grid-cols-4">
            {NODES.map((_, i) => (
              <div key={i} className="relative flex items-center justify-center">
                <motion.span
                  aria-hidden
                  className="relative inline-block h-2.5 w-2.5 rounded-full bg-gold"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    delay: 0.35 + i * 0.28,
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                  }}
                >
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-gold/40"
                    animate={
                      inView
                        ? { scale: [1, 2.2, 1], opacity: [0.5, 0, 0] }
                        : {}
                    }
                    transition={{
                      delay: 0.8 + i * 0.28,
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 1.8,
                      ease: "easeOut",
                    }}
                  />
                </motion.span>
              </div>
            ))}
          </div>
        </div>

        {/* Stems + cards */}
        <div className="mt-0 grid grid-cols-4 gap-4">
          {NODES.map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              <motion.span
                aria-hidden
                className="block w-px bg-gradient-to-b from-gold/60 to-gold/0"
                style={{ height: 28, transformOrigin: "top" }}
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: 0.55 + i * 0.28, duration: 0.45, ease: EASE }}
              />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + i * 0.28, duration: 0.6, ease: EASE }}
                whileHover={{ y: -3 }}
                className="w-full rounded-xl border border-ink/15 bg-paper px-4 py-4 text-center shadow-[0_12px_40px_-24px_rgba(0,0,0,0.35)] transition-shadow hover:shadow-[0_18px_50px_-22px_rgba(0,0,0,0.45)]"
              >
                {n.deva && (
                  <p className="deva text-sm text-gold leading-tight">{n.deva}</p>
                )}
                <p
                  className={`display ${
                    n.deva ? "mt-1.5" : ""
                  } text-[15px] leading-tight text-ink`}
                >
                  {n.en}
                </p>
                {n.subtitle && (
                  <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-ink-faint">
                    {n.subtitle}
                  </p>
                )}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────  Mobile: vertical fallback  ────────── */}
      <ul className="flex flex-col gap-0 md:hidden">
        {NODES.map((n, i) => (
          <li
            key={i}
            className="relative flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.18, duration: 0.5, ease: EASE }}
              className="relative z-10 w-full max-w-sm rounded-xl border border-ink/15 bg-paper px-6 py-4 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.25)]"
            >
              {n.deva && <p className="deva text-base text-gold">{n.deva}</p>}
              <p
                className={`display ${
                  n.deva ? "mt-1" : ""
                } text-lg text-ink`}
              >
                {n.en}
              </p>
              {n.subtitle && (
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-faint">
                  {n.subtitle}
                </p>
              )}
            </motion.div>
            {i < NODES.length - 1 && (
              <motion.span
                aria-hidden
                initial={{ scaleY: 0 }}
                animate={inView ? { scaleY: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.18, duration: 0.4 }}
                style={{ transformOrigin: "top" }}
                className="my-2 h-12 w-px bg-gradient-to-b from-gold/60 to-gold/0"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
