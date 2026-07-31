"use client";

import Link from "next/link";
import type { Course } from "@/lib/constants";
import { motion } from "framer-motion";
import RegionPrice from "./RegionPrice";

export default function CourseCard({
  course,
  index = 0,
  showPrice = true,
}: {
  course: Course;
  index?: number;
  showPrice?: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex"
    >
      <Link
        href={`/programs/${course.slug}`}
        className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-ink/[0.06] bg-paper transition-all duration-500 hover:-translate-y-2 hover:border-saffron/20 hover:shadow-[0_24px_80px_-32px_rgba(192,83,31,0.18)]"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-saffron via-gold to-saffron opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
              {course.tradition}
            </span>
            {course.formats && (
              <span className="shrink-0 rounded-full border border-saffron/25 bg-saffron/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-saffron">
                Live on Zoom
              </span>
            )}
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

          {/* Footer row */}
          <div className="mt-6 flex items-center justify-between border-t border-ink/[0.06] pt-5">
            {showPrice ? (
              <div className="flex flex-col">
                <span className="display text-xl text-ink">
                  <RegionPrice inr={course.priceINR} foreignInr={course.priceForeignINR} />
                </span>
                <span className="text-[11px] text-ink-faint">{course.duration}</span>
              </div>
            ) : (
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                {course.duration}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm font-semibold text-saffron transition-transform duration-300 group-hover:translate-x-1">
              View course
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
