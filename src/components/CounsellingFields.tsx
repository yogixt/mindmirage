"use client";

import { useCart } from "@/lib/cart";
import { GUIDANCE_SUBJECTS, formatINR } from "@/lib/constants";
import Reveal from "./Reveal";

const FIELDS = [
  { deva: "गृहस्थाश्रम", name: "Grihasthāshrama", text: "Couple counselling — navigating marriage, family duties, and shared dharma through the wisdom of the Grihastha āshrama." },
  { deva: "रजस्वला", name: "Rajaswalā", text: "Pre-conception counselling — preparing body, mind, and spirit for the journey of parenthood." },
  { deva: "साधक", name: "Sādhak", text: "Yogic life counselling — aligning your daily life with the principles of sādhana and self-inquiry." },
  { deva: "वैराग्य", name: "Vairāgya", text: "Post-trauma counselling — moving through loss and pain with the steadying gaze of dispassion." },
  { deva: "स्त्रीधर्म", name: "Strīdharma", text: "Femininity counselling — understanding the feminine principle through the Śāstras and living tradition." },
  { deva: "पुरुषधर्म", name: "Puruṣdharma", text: "Masculinity counselling — exploring the masculine ideal as taught in the Itihāsas and Purāṇas." },
  { deva: "बालसंस्कार", name: "Bālasaṁskāra", text: "Child counselling — guiding children through saṁskāras, education, and the shaping of character." },
];

export default function CounsellingFields() {
  const { has, add } = useCart();

  const subjectFor = (name: string) =>
    GUIDANCE_SUBJECTS.find((s) => s.name === name);

  return (
    <section className="px-6 pb-4">
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FIELDS.map((f, i) => {
          const subject = subjectFor(f.name);
          const slug = subject ? `1on1-${subject.slug}` : "";
          const inCart = slug ? has(slug) : false;

          return (
            <Reveal key={f.name} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva text-lg text-saffron">{f.deva}</p>
                <p className="display mt-2 text-lg text-ink">{f.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                {subject && subject.priceINR > 0 && (
                  <>
                    <p className="mt-auto pt-4 text-sm font-semibold text-ink">
                      {formatINR(subject.priceINR)}
                    </p>
                    <button
                      type="button"
                      onClick={() => add(slug)}
                      className="mt-2 w-full rounded-lg border border-ink/15 bg-transparent px-4 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-paper hover:scale-[1.02]"
                    >
                      {inCart ? "In basket" : "Add to basket"}
                    </button>
                  </>
                )}
              </div>
            </Reveal>
          );
        })}

        {/* ALL card */}
        <Reveal delay={0.56}>
          <div className="flex h-full flex-col rounded-2xl border border-saffron/30 bg-saffron-soft/10 p-5 ring-1 ring-saffron/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
            <p className="deva text-lg text-saffron">सर्वपरामर्श</p>
            <p className="display mt-2 text-lg text-ink">All Fields</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              All seven counselling fields bundled — couple, pre-conception, yogic life, post-trauma, femininity, masculinity, child.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-ink">
              {formatINR(7000)}
            </p>
            <button
              type="button"
              onClick={() => add("counselling-all")}
              className="mt-2 w-full rounded-lg bg-saffron px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-clay hover:scale-[1.02]"
            >
              {has("counselling-all") ? "In basket" : "Add all to basket"}
            </button>
          </div>
        </Reveal>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs text-ink-faint">
        Counselling is contemplative, not clinical — for medical or psychiatric
        care, please also consult a qualified professional.
      </p>
    </section>
  );
}
