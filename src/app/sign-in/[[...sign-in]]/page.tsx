import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleSignIn from "./GoogleSignIn";
import PasswordAuth from "@/components/PasswordAuth";

export const metadata: Metadata = {
  title: "Sādhak Sign-in",
};

export default function SignInPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <section className="min-h-[calc(100vh-200px)] pt-24 pb-8 px-6 sm:pt-36 flex flex-col items-center">
        <p className="deva text-xl text-ink-soft">शिष्य प्रवेश</p>
        <div className="mt-8 w-full max-w-sm">
          <PasswordAuth mode="signin" />

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-xs uppercase tracking-wider text-ink-faint">or</span>
            <span className="h-px flex-1 bg-ink/10" />
          </div>

          <GoogleSignIn />
        </div>
      </section>
      <Footer />
    </main>
  );
}
