import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSeekerUserId } from "@/lib/auth";
import { getQuestion } from "@/lib/journal";
import { CommentForm, LikeButton } from "../JournalClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const data = await getQuestion(Number(id));
  return { title: data ? data.question.title : "Question" };
}

function formatDate(iso: string) {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

export default async function QuestionPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const questionId = Number(id);
  if (!Number.isInteger(questionId) || questionId <= 0) notFound();

  const viewerId = await getSeekerUserId();
  const data = await getQuestion(questionId, viewerId);
  if (!data) notFound();
  const { question, comments } = data;

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <article className="px-6 pt-24 pb-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/journal"
            className="text-xs uppercase tracking-[0.2em] text-ink-faint hover:text-ink"
          >
            ← All questions
          </Link>

          <h1 className="display mt-4 text-3xl text-ink sm:text-4xl">
            {question.title}
          </h1>
          <p className="mt-2 text-xs text-ink-faint">
            {question.author} · {formatDate(question.created_at)}
          </p>
          {question.body && (
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-ink">
              {question.body}
            </p>
          )}
          <div className="mt-5">
            <LikeButton
              questionId={question.id}
              likes={question.likes}
              liked={question.likedByMe}
              signedIn={!!viewerId}
            />
          </div>

          {/* Reflections */}
          <div className="mt-10 border-t border-ink/10 pt-6">
            <p className="eyebrow">
              {comments.length} {comments.length === 1 ? "reflection" : "reflections"}
            </p>
            <div className="mt-4 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="rounded-2xl border border-ink/8 bg-paper-warm/60 p-4">
                  <p className="text-xs text-ink-faint">
                    {c.author} · {formatDate(c.created_at)}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <CommentForm questionId={question.id} signedIn={!!viewerId} />
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
