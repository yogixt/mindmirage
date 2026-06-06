import Link from "next/link";
import type { Course } from "@/lib/constants";
import Reveal from "./Reveal";

export default function CourseCard({
  course,
  index = 0,
}: {
  course: Course;
  index?: number;
}) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="flex">
      <Link
        href={`/programs/${course.slug}`}
        className="group relative flex w-full flex-col rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]"
      >
        <p className="eyebrow">{String(index + 1).padStart(2, "0")} · {course.tradition}</p>
        <p className="deva mt-5 text-2xl text-ink">{course.deva}</p>
        <h3 className="display mt-2 text-2xl text-ink">{course.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{course.excerpt}</p>
        <div className="mt-6 flex items-center justify-between text-xs text-ink-faint">
          <span>{course.duration.split("·")[0].trim()}</span>
          <span className="display text-base text-ink transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
