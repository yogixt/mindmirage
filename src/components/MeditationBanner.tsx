"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { COURSES } from "@/lib/constants";

/* ────────────────────────────────────────────────────────────
   Meditation · Dhyāna — course landing (three levels).
   Mirrors Yoga/Ashtanga Hridayam's hero + facts + benefits +
   inclusions layout. The actual enrolment/payment always happens
   on /programs/meditation (CourseCta) — this page never talks to
   Razorpay directly, so pricing/region logic has one source of
   truth instead of drifting out of sync with the catalog.
   Fonts are provided as CSS variables by app/meditation/page.tsx.
   ──────────────────────────────────────────────────────────── */

const SERIF = "var(--font-cormorant), var(--font-noto-deva), Georgia, serif";
const BODY = "var(--font-mukta), var(--font-noto-deva), system-ui, sans-serif";

const FACTS = [
  { big: "3", small: "Progressive levels" },
  { big: "10", small: "Hours of guided practice" },
  { big: "2", small: "Modes · Online & Ashram" },
  { big: "All", small: "Levels welcome" },
];

const BENEFITS = [
  { hi: "मन की शांति और तनाव से मुक्ति", en: "Inner calm & freedom from stress" },
  { hi: "जागरूकता में वृद्धि और आत्म-सम्बन्ध", en: "Greater awareness & self-connection" },
  { hi: "भावनात्मक संतुलन और सकारात्मकता", en: "Emotional balance & positivity" },
  { hi: "एकाग्रता और मानसिक स्पष्टता", en: "Sharper focus & mental clarity" },
];

const INCLUSIONS = [
  { name: "Five Element Balancing Meditation" },
  { name: "Nervous System regulation through Breath" },
  { name: "Focus Meditation" },
  { name: "Yoga Nidra" },
  { name: "Mantra Meditation" },
  { name: "Guided Visualization" },
  { name: "Contemplation Meditation" },
  { name: "Upasana Meditation" },
  { name: "Healing Meditation" },
  { name: "Online Class (Live Interactive Sessions)", isNew: true },
];

export default function MeditationBanner() {
  // Default to the self-contained typographic hero; swap in the exported
  // artwork only once we confirm it loads (SSR-safe — never shows a broken img).
  const [heroImgOk, setHeroImgOk] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHeroImgOk(true);
    img.src = "/meditation/banner-hero.png";
  }, []);

  const bookingRef = useRef<HTMLElement | null>(null);
  const levels = COURSES.find((c) => c.slug === "meditation")?.levels ?? [];

  return (
    <div
      className="mm-meditation"
      style={{
        fontFamily: BODY,
        background: "#F6EFDD",
        color: "#46453E",
        padding: "32px 20px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      {/* Scoped focus / placeholder styling + hover lift */}
      <style>{`
        .mm-meditation input:focus, .mm-meditation select:focus {
          outline: none; border-color: #C97A45 !important;
        }
        .mm-meditation input::placeholder { color: #A99F86; }
        .mm-lift { transition: transform .15s ease; }
        .mm-lift:hover { transform: translateY(-2px); }
        .mm-level-card { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
        .mm-level-card:hover { transform: translateY(-4px); border-color: #C97A45; box-shadow: 0 18px 34px -16px rgba(192,83,31,0.5); }
      `}</style>

      {/* ============ HERO BANNER ============ */}
      <section
        style={{
          width: "100%",
          maxWidth: 1160,
          background: "#F8F2E2",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 70px -42px rgba(70,69,62,0.55)",
        }}
      >
        {heroImgOk ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/meditation/banner-hero.png"
            alt="Breathe. Balance. Become. — Mind Mirage India"
            style={{ width: "100%", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "16 / 7",
              background:
                "radial-gradient(120% 140% at 50% 0%, #F4ECD6 0%, #EAE7D3 45%, #DCE2CE 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "48px 24px",
              gap: 14,
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#C97A45",
              }}
            >
              Mind Mirage India · Rishikesh
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: "clamp(38px, 7vw, 76px)",
                lineHeight: 1.02,
                color: "#46453E",
              }}
            >
              Breathe.{" "}
              <span style={{ fontStyle: "italic", color: "#C97A45" }}>Balance.</span> Become.
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(20px, 3vw, 30px)", color: "#6A6A5E" }}>
              ध्यान · the art of stillness
            </div>
          </div>
        )}

        {/* CTA strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
            padding: "24px 40px 30px",
            background: "#F8F2E2",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
              <span
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontStyle: "italic",
                  fontSize: 34,
                  lineHeight: 1,
                  color: "#46453E",
                }}
              >
                ध्यान
              </span>
              <span
                style={{
                  display: "inline-block",
                  background: "transparent",
                  border: "1.5px solid #C97A45",
                  color: "#C97A45",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "2.5px",
                  padding: "6px 14px",
                  borderRadius: 100,
                }}
              >
                MEDITATION · THREE LEVELS
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#6A6A5E" }}>
              A graded path into stillness · Online or at our Rishikesh ashram
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="mm-lift"
            style={{
              border: "none",
              cursor: "pointer",
              background: "#C97A45",
              color: "#FBF6E9",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "0.3px",
              padding: "15px 28px",
              borderRadius: 100,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 14px 30px -14px rgba(201,122,69,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            Choose Your Level
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      </section>

      {/* ============ FACTS RIBBON ============ */}
      <section
        className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4"
        style={{ maxWidth: 1160 }}
      >
        {FACTS.map((fact) => (
          <div
            key={fact.small}
            style={{
              background: "#FBF6E9",
              border: "1px solid #E7DEC6",
              borderRadius: 18,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 34,
                color: "#C97A45",
                lineHeight: 1,
              }}
            >
              {fact.big}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14, color: "#6A6A5E" }}>{fact.small}</div>
          </div>
        ))}
      </section>

      {/* ============ BENEFITS ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C97A45", marginBottom: 6 }}>
            Benefits
          </div>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>
            What this practice cultivates
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.en}
              style={{
                background: "#FBF6E9",
                border: "1px solid #E7DEC6",
                borderRadius: 18,
                padding: "24px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 11,
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "#E7E9DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8C9E7C",
                  fontSize: 12,
                }}
              >
                ◆
              </span>
              <div style={{ fontWeight: 600, fontSize: 16, color: "#46453E", lineHeight: 1.4 }}>{b.en}</div>
              <div style={{ fontSize: 13, color: "#9a9280", lineHeight: 1.6 }}>{b.hi}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ INCLUSIONS ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div
          style={{
            background: "#EEE7D3",
            border: "1px solid #E3D9C0",
            borderRadius: 28,
            padding: "40px 44px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#C97A45",
                marginBottom: 6,
              }}
            >
              Inclusions
            </div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>
              Ten practices, one journey
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-11 md:grid-cols-2">
            {INCLUSIONS.map((inc) => (
              <div
                key={inc.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "13px 0",
                  borderBottom: "1px solid #E3D9C0",
                }}
              >
                <span style={{ color: "#C97A45", fontSize: 11 }}>◆</span>
                <span style={{ fontWeight: 500, fontSize: 16, color: "#46453E", flex: 1 }}>
                  {inc.name}
                </span>
                {inc.isNew && (
                  <span
                    style={{
                      background: "#8C9E7C",
                      color: "#FBF6E9",
                      fontWeight: 700,
                      fontSize: 10,
                      letterSpacing: "1px",
                      padding: "3px 9px",
                      borderRadius: 100,
                    }}
                  >
                    NEW
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CHOOSE YOUR LEVEL ============ */}
      <section
        ref={bookingRef}
        style={{ width: "100%", maxWidth: 1160, scrollMarginTop: 88 }}
      >
        <div
          style={{
            position: "relative",
            background: "#EEE7D3",
            border: "1px solid #E3D9C0",
            borderRadius: 28,
            overflow: "hidden",
            padding: 40,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#C97A45",
                marginBottom: 6,
              }}
            >
              Enrol level by level
            </div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1, letterSpacing: "-0.5px" }}>
              Choose your level
            </h2>
            <p style={{ margin: "10px auto 0", maxWidth: 520, fontSize: 15, color: "#6A6A5E", lineHeight: 1.55 }}>
              Each level is taken and enrolled on its own — begin at Level 1 and progress at
              your own pace.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {levels.map((lv, i) => (
              <Link
                key={lv.slug}
                href={`/programs/meditation?level=${lv.slug}#enrol`}
                className="mm-level-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  background: "#FBF6E9",
                  border: "1.5px solid #E7DEC6",
                  borderRadius: 20,
                  padding: 24,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px -16px rgba(70,45,20,0.3)",
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #C97A45, #C9A227)",
                    color: "#FBF6E9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: SERIF,
                    fontWeight: 700,
                    fontSize: 18,
                    boxShadow: "0 6px 16px -4px rgba(192,83,31,0.65)",
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E" }}>
                  {lv.label}
                </div>
                {lv.note && (
                  <p style={{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.55, color: "#6A6A5E" }}>
                    {lv.note}
                  </p>
                )}
                <span
                  style={{
                    marginTop: 6,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#C97A45",
                  }}
                >
                  Enrol in {lv.label}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "#A99F86" }}>
            Secure checkout · UPI · Cards · Netbanking — Powered by Razorpay
          </p>
        </div>
      </section>

      {/* ============ VENUE / CONTACT ============ */}
      <section
        className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_1.2fr_1fr]"
        style={{ maxWidth: 1160 }}
      >
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>
            Timings
          </div>
          <div style={{ fontSize: 16, color: "#46453E", lineHeight: 1.5 }}>
            Morning &amp; Evening slots available · Offline at the ashram or Online (live interactive)
          </div>
        </div>
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>
            Venue
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E", lineHeight: 1.15, marginBottom: 6 }}>
            Advaita Sādhanā Kuṭīr Ashram
          </div>
          <div style={{ fontSize: 15, color: "#6A6A5E", lineHeight: 1.5 }}>
            Nirmal Block B, Water Tank Road, Rishikesh
            <br />
            <span style={{ fontSize: 13, color: "#9a9280" }}>अद्वैत साधना कुटीर · ऋषिकेश</span>
          </div>
        </div>
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>
            Contact
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E", marginBottom: 4 }}>
            +91 72492 84401
          </div>
          <a
            href="https://mindmirageindia.com/"
            target="_blank"
            rel="noreferrer noopener"
            style={{ fontSize: 15, color: "#C97A45", textDecoration: "none", fontWeight: 600 }}
          >
            mindmirageindia.com
          </a>
        </div>
      </section>

      {/* ============ TAGLINE ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <span style={{ width: 56, height: 1, background: "#DCCFB2" }} />
            <span style={{ color: "#C97A45", fontSize: 12 }}>◆</span>
            <span style={{ width: 56, height: 1, background: "#DCCFB2" }} />
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(24px, 4vw, 36px)", color: "#46453E", marginTop: 16, lineHeight: 1.2 }}>
            A quiet mind · an aware life · a whole being
          </div>
          <div style={{ fontSize: 14, color: "#9a9280", marginTop: 8 }}>
            शांत मन · जागरूक जीवन · पूर्ण अस्तित्व
          </div>
        </div>
      </section>
    </div>
  );
}
