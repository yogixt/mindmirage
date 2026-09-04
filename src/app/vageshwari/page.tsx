import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { canReadVageshwari, getSeekerUserId } from "@/lib/auth";
import { listPosts } from "@/lib/db";
import PostCard from "./FeedClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brahmavadini, Blogs & News from Guruji and the Team",
  description:
    "Blogs, news, photos, and updates written by Acharya Bhagyashree Joshi Ji and the Mind Mirage team, sign in to read, like, and join the conversation.",
};

/* ──────────  Gate Card (shared layout)  ────────── */
function GateCard({
  deva,
  heading,
  body,
  ctaHref,
  ctaLabel,
  footer,
}: {
  deva: string;
  heading: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  footer?: React.ReactNode;
}) {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-lg">
        <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-warm p-10 text-center sm:p-12">
          {/* Saffron top accent */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />
          <p className="deva text-2xl text-gold">{deva}</p>
          <p
            className="display mt-3 text-3xl text-ink sm:text-4xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            {heading}
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            {body}
          </p>
          <Link
            href={ctaHref}
            className="mt-6 inline-flex rounded-full bg-saffron px-10 py-3.5 text-sm font-medium text-paper transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-saffron/20"
          >
            {ctaLabel}
          </Link>
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </div>
    </section>
  );
}

export default async function VageshwariPage() {
  const viewerId = await getSeekerUserId();

  // Not signed in — show the gate.
  if (!viewerId) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Brahmavadini · पत्रिका"
          deva="कुटीर पत्रिका"
          title={
            <>
              Letters from the <span className="italic text-ink-soft">kuṭīr.</span>
            </>
          }
          description={
            <>
              Blogs and news written by Acharya Ji and the team, with photos,
              links, and conversations beneath each one.
            </>
          }
        />
        <GateCard
          deva="कुटीर पत्रिका"
          heading="For sādhaks' eyes."
          body="Brahmavadini is read inside the satsang, sign in (free) to read, like, and comment."
          ctaHref="/sign-in"
          ctaLabel="Sign in to read"
          footer={
            <p className="text-sm text-ink-faint">
              New here?{" "}
              <Link
                href="/sign-up"
                className="text-saffron underline underline-offset-2"
              >
                Create a sādhak account
              </Link>
            </p>
          }
        />
        <Footer />
      </main>
    );
  }

  // Signed in but not yet enrolled
  if (!(await canReadVageshwari())) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Brahmavadini · पत्रिका"
          deva="कुटीर पत्रिका"
          title={
            <>
              Letters from the <span className="italic text-ink-soft">kuṭīr.</span>
            </>
          }
          description={
            <>
              Blogs and news written by Acharya Ji and the team, for sādhaks
              walking with us.
            </>
          }
        />
        <GateCard
          deva="कुटीर पत्रिका"
          heading="Begin your journey first."
          body="Brahmavadini opens to sādhaks who have enrolled in a course, once your journey with us begins, the letters are yours."
          ctaHref="/programs"
          ctaLabel="Browse the offerings"
        />
        <Footer />
      </main>
    );
  }

  const posts = await listPosts(viewerId);

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Brahmavadini · पत्रिका"
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

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          {posts.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-ink/10 bg-paper-warm p-10 text-center">
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-saffron via-gold to-saffron" />
              <p className="display text-2xl text-ink">The first letter is being written.</p>
              <p className="mt-3 text-base text-ink-soft">
                Blogs, news, and photos from the kuṭīr will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
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
