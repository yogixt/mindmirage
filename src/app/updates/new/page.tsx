import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { isAdmin } from "@/lib/auth";
import NewUpdateForm from "./NewUpdateForm";

export const dynamic = "force-dynamic";

export default async function NewUpdatePage() {
  if (!(await isAdmin())) redirect("/updates");

  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="Team · backend"
        deva="नवीन सूचना"
        title={
          <>
            Post an <span className="italic text-ink-soft">update.</span>
          </>
        }
        description="Visible to everyone on the Updates page the moment you post."
      />
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-2xl">
          <NewUpdateForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
