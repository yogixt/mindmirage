"use client";

import { useCart } from "@/lib/cart";
import { GUIDANCE_SUBJECTS } from "@/lib/constants";
import Reveal from "./Reveal";

const FIELDS = [
  { deva: "गृहस्थाश्रम", name: "Grihasthāshrama", text: "Couple counselling — navigating marriage, family duties, and shared dharma through the wisdom of the Grihastha āshrama." },
  { deva: "रजस्वला", name: "Rajaswalā", text: "Pre-conception counselling — preparing body, mind, and spirit for the journey of parenthood." },
  { deva: "साधक", name: "Sādhak", text: "Yogic life counselling — aligning your daily life with the principles of sādhana and self-inquiry." },
  { deva: "वैराग्य", name: "Vairāgya", text: "Post-trauma counselling — moving through loss and pain with the steadying gaze of dispassion." },
  { deva: "स्त्रीधर्म", name: "Strīdharma", text: "Femininity counselling — understanding the feminine principle through the Śāstras and living tradition." },
  { deva: "पुरुषधर्म", name: "Puruṣdharma", text: "Masculinity counselling — exploring the masculine ideal as taught in the Itihāsas and Purāṇas." },
  { deva: "बालसंस्कार", name: "Bālasaṁskāra", text: "Child-related counselling — guiding children through saṁskāras, education, and the shaping of character." },
];

export default function CounsellingFields() {
  const { has, add, setOpen } = useCart();

  const subjectFor = (name: string) =>
    GUIDANCE_SUBJECTS.find((s) => s.name.startsWith(name));

  const handleCartAction = (slug: string) => {
    if (!slug) return;
    if (!has(slug)) {
      add(slug);
    } else {
      setOpen(true);
    }
  };

  return (
    <section className="px-6 py-10 sm:py-16 bg-paper">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <p className="eyebrow">Areas of focus</p>
        <h2 className="display mt-4 text-3xl text-ink sm:text-4xl" style={{ lineHeight: "1.05", letterSpacing: "-0.02em" }}>
          Fields of <span className="italic text-ink-soft">counselling.</span>
        </h2>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FIELDS.map((f, i) => {
          const subject = subjectFor(f.name);
          const slug = subject ? `1on1-${subject.slug}` : "";
          const inCart = slug ? has(slug) : false;
          const price = subject ? subject.priceINR : 2000;

          return (
            <Reveal key={f.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-ink/8 bg-paper-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
                <p className="deva text-lg text-saffron">{f.deva}</p>
                <p className="display mt-2 text-lg text-ink">{f.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                
                <p className="mt-auto pt-4 text-sm font-semibold text-ink">
                  ₹{price.toLocaleString("en-IN")}
                </p>
                
                <button
                  type="button"
                  onClick={() => handleCartAction(slug)}
                  className={`mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    inCart
                      ? "border border-saffron bg-saffron/5 text-saffron"
                      : "bg-saffron text-white hover:bg-clay"
                  }`}
                >
                  {inCart ? "In basket — view" : "Add to basket"}
                </button>
              </div>
            </Reveal>
          );
        })}

        {/* ALL card */}
        <Reveal delay={0.42}>
          <div className="flex h-full flex-col rounded-2xl border border-saffron/30 bg-saffron-soft/10 p-5 ring-1 ring-saffron/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)]">
            <p className="deva text-lg text-saffron">सर्वपरामर्श</p>
            <p className="display mt-2 text-lg text-ink">All Fields</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              All seven counselling fields bundled — couple, pre-conception, yogic life, post-trauma, femininity, masculinity, child.
            </p>
            <p className="mt-auto pt-4 text-sm font-semibold text-ink">
              ₹11,000
            </p>
            <button
              type="button"
              onClick={() => handleCartAction("counselling-all")}
              className={`mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                has("counselling-all")
                  ? "border border-saffron bg-saffron/5 text-saffron"
                  : "bg-saffron text-white hover:bg-clay"
              }`}
            >
              {has("counselling-all") ? "In basket — view" : "Add all to basket"}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
