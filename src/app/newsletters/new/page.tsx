import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import NewPostForm from "./NewPostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!(await isAdmin())) redirect("/newsletters");

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Team · backend"
        deva="नवीन पत्र"
        title={
          <>
            Write to the <span className="italic text-ink-soft">satsang.</span>
          </>
        }
        description="Blogs, news, photos, links — visible to signed-in seekers the moment you post."
      />
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-2xl">
          <NewPostForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
