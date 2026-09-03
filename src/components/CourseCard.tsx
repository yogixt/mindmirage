"use client";

import Link from "next/link";
import type { Course } from "@/lib/constants";
import { motion } from "framer-motion";

export default function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  const hasLevels = !!course.levels && course.levels.length > 0 && !course.hideLevelsOnListing;

  return (
    <motion.div
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex"
    >
      <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-500 hover:-translate-y-2 hover:border-saffron/20 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.18)]">
        {/* Ambient hover glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br from-saffron/25 via-gold/20 to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        />
        {/* Oversized devanagari watermark */}
        <span
          aria-hidden
          className="deva pointer-events-none absolute -right-1 -top-4 select-none text-[6rem] leading-none text-ink/[0.035] transition-transform duration-500 group-hover:scale-105"
        >
          {course.deva}
        </span>

        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

        <Link href={`/programs/${course.slug}`} className="relative flex flex-1 flex-col p-5 sm:p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              {course.tradition}
            </span>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              {course.formats && (
                <span className="rounded-full border border-saffron/25 bg-saffron/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-saffron">
                  Live on Zoom
                </span>
              )}
              {hasLevels && (
                <span className="rounded-full border border-saffron/25 bg-saffron/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-saffron">
                  {course.levels!.length} Levels
                </span>
              )}
            </div>
          </div>

          {/* Devanagari title */}
          <p className="deva mt-5 text-[1.65rem] leading-tight text-ink">
            {course.deva}
          </p>

          {/* English title */}
          <h3 className="display mt-1.5 text-[1.75rem] leading-[1.1] tracking-tight text-ink">
            {course.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
            {course.excerpt}
          </p>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {course.syllabus.slice(0, 3).map((s) => (
              <span
                key={s}
                className="rounded-full bg-paper-deep px-3 py-1 text-[11px] font-medium text-ink-soft"
              >
                {s.split(" — ")[0]}
              </span>
            ))}
            {course.syllabus.length > 3 && (
              <span className="text-[11px] text-ink-faint">
                +{course.syllabus.length - 3} more
              </span>
            )}
          </div>
        </Link>

        {/* Footer — level picker, or plain view-course link */}
        {hasLevels ? (
          <div className="relative border-t border-ink/[0.06] bg-gradient-to-b from-gold/[0.05] to-transparent px-5 pb-5 pt-4 sm:px-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                Choose your level
              </span>
              <Link
                href={`/programs/${course.slug}`}
                className="text-[11px] font-semibold text-saffron hover:underline"
              >
                Details
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {course.levels!.map((lv, i) => (
                <Link
                  key={lv.slug}
                  href={`/programs/${course.slug}?level=${lv.slug}#enrol`}
                  className="group/lvl relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border border-ink/[0.07] bg-paper px-2 py-3.5 text-center shadow-[0_2px_10px_-6px_rgba(70,45,20,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-saffron/40 hover:shadow-[0_18px_34px_-16px_rgba(192,83,31,0.5)]"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-saffron/0 to-gold/0 opacity-0 transition-opacity duration-300 group-hover/lvl:from-saffron/[0.08] group-hover/lvl:to-gold/[0.1] group-hover/lvl:opacity-100"
                  />
                  <span className="relative flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-gold text-[12px] font-bold text-white shadow-[0_4px_12px_-3px_rgba(192,83,31,0.65)] transition-transform duration-300 group-hover/lvl:scale-110">
                    {i + 1}
                  </span>
                  <span className="relative text-[11px] font-semibold leading-tight text-ink">
                    {lv.note ? lv.note.split(" — ")[0] : lv.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            href={`/programs/${course.slug}`}
            className="relative flex items-center justify-between border-t border-ink/[0.06] px-5 pb-5 pt-4 sm:px-6"
          >
            <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-saffron transition-transform duration-300 group-hover:translate-x-1">
              View course
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
