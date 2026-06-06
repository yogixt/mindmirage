import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sādhak Sign-in",
};

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Sādhak login"
          deva="शिष्य प्रवेश"
          title={
            <>
              Not yet <span className="italic text-ink-soft">configured.</span>
            </>
          }
          description={
            <>
              Add your Clerk keys to <code className="font-mono text-ink">.env.local</code> to
              open the sādhak portal. Until then, every program is reachable
              directly through Acharya Ji.
            </>
          }
        >
          <Link
            href="/contact"
            className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
          >
            Begin without a login
          </Link>
        </PageHero>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <section className="min-h-[calc(100vh-200px)] pt-24 pb-4 px-6 sm:pt-36 flex flex-col items-center">
        <p className="deva text-xl text-ink-soft">शिष्य प्रवेश</p>
        <div className="mt-4 w-full flex justify-center">
          <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/dashboard" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
