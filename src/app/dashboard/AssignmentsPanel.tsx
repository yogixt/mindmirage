"use client";

import { useEffect, useRef, useState } from "react";

/* Self-paced assignment flow, sādhak side.
   Shows the current lesson's questions per enrolled course, takes a photo
   of the handwritten assignment, and submits it. The next lesson unlocks
   once the team approves. */

type CourseState = {
  slug: string;
  title: string;
  deva: string;
  currentLesson: number;
  questions: string | null;
  file: string | null;
  fileName: string | null;
  videoUrl: string | null;
  submissionStatus: "pending" | "approved" | "returned" | null;
  currentRemarks: string | null;
  lastReview: {
    lesson: number;
    status: string;
    marks: number | null;
    remarks: string | null;
  } | null;
};

/* YouTube links become an inline player; other links open as a button. */
function youtubeEmbed(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
  );
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

/* Downscale the photo to a JPEG data URL the API will accept. */
async function compressImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const MAX = 1400;
    const scale = Math.min(1, MAX / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function AssignmentsPanel() {
  const [courses, setCourses] = useState<CourseState[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = () =>
    fetch("/api/assignments")
      .then((r) => r.json())
      .then((d) => d.ok && setCourses(d.courses))
      .catch(() => {})
      .finally(() => setLoaded(true));

  useEffect(() => {
    void refresh();
  }, []);

  if (!loaded || courses.length === 0) return null;

  return (
    <section>
      <div className="border-b border-ink/10 pb-2">
        <h2 className="display text-xl text-ink sm:text-2xl">Assignments</h2>
        <p className="mt-1 text-xs text-ink-soft">
          After each video lesson, submit your handwritten assignment — the
          next lesson unlocks once the team reviews it.
        </p>
      </div>
      <div className="mt-3 space-y-3">
        {courses.map((c) => (
          <CourseAssignment key={c.slug} course={c} onSubmitted={refresh} />
        ))}
      </div>
    </section>
  );
}

function CourseAssignment({
  course,
  onSubmitted,
}: {
  course: CourseState;
  onSubmitted: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (file: File) => {
    setError(null);
    setSending(true);
    try {
      const image = await compressImage(file);
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          lesson: course.currentLesson,
          image,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? "failed");
      onSubmitted();
    } catch {
      setError("Could not upload — please try a smaller photo or again later.");
    } finally {
      setSending(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const status = course.submissionStatus;

  return (
    <div className="rounded-xl border border-ink/10 bg-paper-warm/40 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="display text-base text-ink">{course.title}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-saffron">
          Lesson {course.currentLesson}
        </p>
      </div>

      {/* The video lesson — unlocked automatically for the current lesson */}
      {course.videoUrl &&
        (youtubeEmbed(course.videoUrl) ? (
          <div className="mt-3 overflow-hidden rounded-xl border border-ink/10">
            <iframe
              src={youtubeEmbed(course.videoUrl)!}
              title={`${course.title} — video lesson ${course.currentLesson}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        ) : (
          <a
            href={course.videoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-clay"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch video lesson {course.currentLesson}
          </a>
        ))}

      {/* Marks and remarks from the team on the last reviewed lesson */}
      {course.lastReview && course.lastReview.status === "approved" && (
        <div className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-800 ring-1 ring-green-200">
          <span className="font-semibold">
            Lesson {course.lastReview.lesson} approved
            {course.lastReview.marks !== null &&
              ` · Marks: ${course.lastReview.marks}/100`}
          </span>
          {course.lastReview.remarks && (
            <p className="mt-0.5 italic">“{course.lastReview.remarks}”</p>
          )}
        </div>
      )}

      {course.questions && (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
          {course.questions}
        </p>
      )}
      {course.file &&
        (course.file.startsWith("data:image") ? (
          <img
            src={course.file}
            alt={`Assignment for lesson ${course.currentLesson}`}
            className="mt-3 max-h-80 rounded-lg border border-ink/10 object-contain"
          />
        ) : (
          <a
            href={course.file}
            download={course.fileName ?? "assignment"}
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-ink"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download assignment — {course.fileName ?? "file"}
          </a>
        ))}
      {!course.questions && !course.file && (
        <p className="mt-2 text-sm text-ink-faint">
          Questions for this lesson are on the way — the team will add them
          soon.
        </p>
      )}

      <div className="mt-3">
        {status === "pending" ? (
          <p className="inline-flex items-center gap-2 rounded-full bg-gold-soft/40 px-3 py-1.5 text-xs font-medium text-ink">
            <span className="size-2 rounded-full bg-gold" aria-hidden />
            Submitted — under review. Your next lesson unlocks after approval.
          </p>
        ) : (
          <>
            {status === "returned" && (
              <div className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 ring-1 ring-red-200">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500" aria-hidden />
                  Returned — please redo and submit again.
                </span>
                {course.currentRemarks && (
                  <p className="mt-0.5 italic">“{course.currentRemarks}”</p>
                )}
              </div>
            )}
            {(course.questions || course.file) && (
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void submit(f);
                  }}
                />
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-full bg-green-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                >
                  {sending
                    ? "Uploading…"
                    : "Upload handwritten assignment (photo)"}
                </button>
                <span className="text-[11px] text-ink-faint">
                  JPG or PNG — a clear photo of your pages
                </span>
              </div>
            )}
          </>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
