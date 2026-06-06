import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { getSeekerUserId } from "@/lib/auth";
import { listQuestions } from "@/lib/journal";
import { AskForm, LikeButton } from "./JournalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Questions from Seekers",
  description:
    "A living journal of seekers' questions on Yoga, Vedānta, meditation, and the inner life — ask, reflect, and read together.",
};

function timeAgo(iso: string) {
  const then = new Date(iso.endsWith("Z") ? iso : `${iso}Z`).getTime();
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(then).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function JournalPage() {
  const viewerId = await getSeekerUserId();
  const questions = await listQuestions(viewerId);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Journal · प्रश्न"
        deva="जिज्ञासा"
        title={
          <>
            Questions from <span className="italic text-ink-soft">seekers.</span>
          </>
        }
        description={
          <>
            Ask what study and practice raise in you. Other seekers reflect;
            Acharya Ji reads along. For her essays, see{" "}
            <Link href="/blog" className="text-saffron underline underline-offset-2">
              the Reflections
            </Link>
            .
          </>
        }
      />

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-3xl">
          <AskForm signedIn={!!viewerId} />

          <div className="mt-6 space-y-3">
            {questions.length === 0 && (
              <div className="rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
                <p className="display text-xl text-ink">No questions yet.</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Be the first to ask — every inquiry helps another seeker.
                </p>
              </div>
            )}
            {questions.map((q) => (
              <Link
                key={q.id}
                href={`/journal/${q.id}`}
                className="block rounded-2xl border border-ink/8 bg-paper p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]"
              >
                <h2 className="display text-xl text-ink">{q.title}</h2>
                {q.body && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft line-clamp-2">
                    {q.body}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-ink-faint">
                  <LikeButton
                    questionId={q.id}
                    likes={q.likes}
                    liked={q.likedByMe}
                    signedIn={!!viewerId}
                  />
                  <span>
                    {q.comments} {q.comments === 1 ? "reflection" : "reflections"}
                  </span>
                  <span>·</span>
                  <span>{q.author}</span>
                  <span>·</span>
                  <span>{timeAgo(q.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
