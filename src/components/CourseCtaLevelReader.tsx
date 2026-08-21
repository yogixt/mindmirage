"use client";

import { useSearchParams } from "next/navigation";
import CourseCta from "./CourseCta";
import type { Course } from "@/lib/constants";

/* Reads ?level= client-side so the course page itself stays statically
   generated — only this leaf re-renders once the query string is known. */
export default function CourseCtaLevelReader({ course }: { course: Course }) {
  const searchParams = useSearchParams();
  return <CourseCta course={course} initialLevel={searchParams.get("level") ?? undefined} />;
}
