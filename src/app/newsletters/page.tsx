import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { canReadNewsletters, getSeekerUserId } from "@/lib/auth";
import { listPosts } from "@/lib/journal";
import PostCard from "./FeedClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletters — Blogs & News from Guruji and the Team",
  description:
    "Blogs, news, photos, and updates written by Acharya Bhagyashree Joshi Ji and the Mind Mirage team — sign in to read, like, and join the conversation.",
};

export default async function NewslettersPage() {
  const viewerId = await getSeekerUserId();

  // Reading requires sign-in — show the gate.
  if (!viewerId) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Newsletters · पत्रिका"
          deva="कुटीर पत्रिका"
          title={
            <>
              Letters from the <span className="italic text-ink-soft">kuṭīr.</span>
            </>
          }
          description={
            <>
              Blogs and news written by Acharya Ji and the team — with photos,
              links, and conversations beneath each one.
            </>
          }
        />
        <section className="px-6 pb-5">
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
            <p className="display text-2xl text-ink">For seekers&apos; eyes.</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The newsletters are read inside the satsang — sign in (free) to
              read, like, and comment.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 inline-flex rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Sign in to read
            </Link>
            <p className="mt-3 text-xs text-ink-faint">
              New here?{" "}
              <Link href="/sign-up" className="text-saffron underline underline-offset-2">
                Create a seeker account
              </Link>
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Signed in but not yet enrolled — the letters open once the journey begins.
  if (!(await canReadNewsletters())) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Newsletters · पत्रिका"
          deva="कुटीर पत्रिका"
          title={
            <>
              Letters from the <span className="italic text-ink-soft">kuṭīr.</span>
            </>
          }
          description={
            <>
              Blogs and news written by Acharya Ji and the team — for seekers
              walking with us.
            </>
          }
        />
        <section className="px-6 pb-5">
          <div className="mx-auto max-w-md rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
            <p className="display text-2xl text-ink">
              Begin your journey first.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              The newsletters open to seekers who have enrolled in a course —
              once your journey with us begins, the letters are yours.
            </p>
            <Link
              href="/programs"
              className="mt-6 inline-flex rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
            >
              Browse the offerings
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const posts = await listPosts(viewerId);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Newsletters · पत्रिका"
        deva="कुटीर पत्रिका"
        title={
          <>
            Letters from the <span className="italic text-ink-soft">kuṭīr.</span>
          </>
        }
        description={
          <>
            Blogs and news from Acharya Ji and the team. Like what stays with
            you; leave a reflection beneath.
          </>
        }
      />

      <section className="px-6 pb-6">
        <div className="mx-auto max-w-2xl">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-ink/10 bg-paper-warm p-8 text-center">
              <p className="display text-xl text-ink">
                The first letter is being written.
              </p>
              <p className="mt-2 text-sm text-ink-soft">
                Blogs, news, and photos from the kuṭīr will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
