import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isClerkConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Seeker Sign-up",
};

export default function SignUpPage() {
  if (!isClerkConfigured()) {
    return (
      <main className="bg-paper">
        <Navbar variant="solid" />
        <PageHero
          eyebrow="Seeker register"
          deva="शिष्य पंजीकरण"
          title={
            <>
              Not yet <span className="italic text-ink-soft">configured.</span>
            </>
          }
          description={
            <>
              Add your Clerk keys to <code className="font-mono text-ink">.env.local</code> to
              open seeker registration. For now, the enrollment form on each
              program page reaches Acharya Ji directly.
            </>
          }
        >
          <Link
            href="/programs"
            className="rounded-lg bg-saffron px-8 py-3 text-sm text-paper transition-transform hover:scale-[1.03]"
          >
            Choose a program
          </Link>
        </PageHero>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <section className="min-h-[calc(100vh-200px)] pt-24 pb-8 px-6 sm:pt-36 flex flex-col items-center">
        <p className="deva text-xl text-ink-soft">शिष्य पंजीकरण</p>
        <div className="mt-6 w-full flex justify-center">
          <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
