import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import LineageTree from "@/components/LineageTree";
import SanskritVerse from "@/components/SanskritVerse";
import Divider from "@/components/Divider";
import { SANSKRIT, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name} — a contemplative learning space rooted in the Advaita tradition of Adi Shankarācārya. Based at Advaita Sādhanā Kuṭīr, Rishikesh.`,
};

export default function AboutPage() {
  return (
    <main className="bg-paper">
      <Navbar variant="solid" />
      <PageHero
        eyebrow="About · हमारे विषय में"
        deva="मन का दर्पण"
        title={
          <>
            A doorway, <span className="italic text-ink-soft">not a catalogue.</span>
          </>
        }
        description={
          <>
            Mind Mirage is a contemplative learning space engaging the Indian
            Knowledge System through Yoga, inquiry, training, research, publications,
            and reflective study — rooted in the gurukulam tradition and the living
            stream of Advaita Paramparā.
          </>
        }
      />

      <section className="px-6 py-4 sm:py-4">
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <p className="eyebrow">Mission</p>
            <p className="mt-4 text-base text-ink leading-relaxed sm:text-lg">
              To offer the timeless teaching of Advaita — the non-dual recognition at
              the root of the Indian philosophical tradition — in a way that meets the
              contemporary sādhak without diluting the depth, the language, or the
              human relationship at its heart.
            </p>
          </div>

          <Divider />

          <div>
            <p className="eyebrow">Tradition</p>
            <div className="mt-4">
              <SanskritVerse
                deva={SANSKRIT.shankara.deva}
                en={SANSKRIT.shankara.en}
                citation={SANSKRIT.shankara.ref}
                align="left"
              />
            </div>
            <p className="mt-4 text-base text-ink leading-relaxed">
              {SITE.tradition}.
            </p>
          </div>

          <Divider />

          <div>
            <p className="eyebrow">Location</p>
            <p className="mt-4 text-base text-ink leading-relaxed">{SITE.location}</p>
            <p className="mt-3 text-sm text-ink-soft">
              Founded by {SITE.founder}.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-warm px-6 py-4 sm:py-4">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow">Paramparā · the unbroken line</p>
          <h2
            className="display mt-4 text-3xl text-ink sm:text-5xl"
            style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}
          >
            How the teaching reaches <span className="italic text-ink-soft">you.</span>
          </h2>
        </div>
        <div className="mt-4 mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-paper py-4 px-6">
          <LineageTree />
        </div>
      </section>
      <Footer />
    </main>
  );
}
