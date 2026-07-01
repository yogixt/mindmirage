"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/* ────────────────────────────────────────────────────────────
   Meditation · Level 01 — course landing + booking / payment.
   Converted from the "Meditation Banner" Claude Design.
   Palette and type are self-contained (warm sand / terracotta,
   Cormorant Garamond + Mukta) so the section keeps its own
   identity inside the site chrome (Navbar / Footer).
   Fonts are provided as CSS variables by app/meditation/page.tsx.
   ──────────────────────────────────────────────────────────── */

const SERIF = "var(--font-cormorant), var(--font-noto-deva), Georgia, serif";
const BODY = "var(--font-mukta), var(--font-noto-deva), system-ui, sans-serif";

const FACTS = [
  { big: "10", small: "Hours of guided practice" },
  { big: "8", small: "Days · 05–12 July" },
  { big: "2", small: "Modes · Online & Ashram" },
  { big: "₹8k / ₹12k", small: "India / Overseas fee" },
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

type Residency = "india" | "abroad";
type Mode = "offline" | "online";
type Slot = "morning" | "evening";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOptions = {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler?: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};
type RazorpayInstance = { open: () => void; on: (event: string, cb: () => void) => void };
type RazorpayCtor = new (options: RazorpayOptions) => RazorpayInstance;

function getRazorpay(): RazorpayCtor | undefined {
  return (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
}

export default function MeditationBanner() {
  const [residency, setResidency] = useState<Residency>("india");
  const [mode, setMode] = useState<Mode>("offline");
  const [slot, setSlot] = useState<Slot>("morning");
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rzpReady, setRzpReady] = useState(false);
  // Default to the self-contained typographic hero; swap in the exported
  // artwork only once we confirm it loads (SSR-safe — never shows a broken img).
  const [heroImgOk, setHeroImgOk] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", upi: "", card: "" });

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHeroImgOk(true);
    img.src = "/meditation/banner-hero.png";
  }, []);

  const bookingRef = useRef<HTMLElement | null>(null);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const price = residency === "abroad" ? 12000 : 8000;
  const priceLabel = "₹" + price.toLocaleString("en-IN");
  const resLabel = residency === "abroad" ? "Overseas participant" : "India resident";
  const modeLabel = mode === "offline" ? "Offline · Ashram" : "Online · Live";
  const slotLabel = slot === "morning" ? "Morning" : "Evening";
  const nameGreeting = form.name ? ", " + form.name.split(" ")[0] : "";

  // choice pill (residency / mode / slot)
  const tab = (active: boolean): React.CSSProperties => ({
    border: active ? "none" : "1px solid #E0D6BC",
    cursor: "pointer",
    flex: 1,
    padding: "13px 10px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    transition: "all .15s ease",
    background: active ? "#C97A45" : "#FBF6E9",
    color: active ? "#FBF6E9" : "#6A6A5E",
  });

  const input: React.CSSProperties = {
    border: "1.5px solid #E0D6BC",
    background: "#FBF6E9",
    borderRadius: 12,
    padding: "13px 14px",
    fontSize: 15,
    color: "#46453E",
    fontFamily: BODY,
    width: "100%",
  };

  // If the checkout script was already cached/loaded, mark ready.
  useEffect(() => {
    if (getRazorpay()) setRzpReady(true);
  }, []);

  async function handlePay() {
    setErrorMsg("");
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name || !email || !phone) {
      setErrorMsg("Please fill in your name, email and phone above.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    const Razorpay = getRazorpay();
    if (!Razorpay) {
      setErrorMsg("Secure checkout is still loading — please try again in a moment.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/meditation/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residency, mode, slot, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `Checkout failed (${res.status}).`);

      const rp = new Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Mind Mirage",
        description: data.title,
        order_id: data.orderId,
        prefill: { name, email, contact: phone },
        theme: { color: "#C97A45" },
        handler: async (r) => {
          try {
            const vr = await fetch("/api/meditation/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature: r.razorpay_signature,
                bookingId: data.bookingId ?? null,
                name,
                email,
                phone,
                residency,
                mode,
                slot,
              }),
            });
            const v = await vr.json();
            if (!vr.ok || !v.ok) throw new Error(v.error || "verification_failed");
            setPaid(true);
          } catch {
            setErrorMsg(
              "Payment went through but confirmation failed. Please message us on WhatsApp with your payment id.",
            );
          } finally {
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rp.on("payment.failed", () => {
        setErrorMsg("Payment failed or was cancelled. Please try again.");
        setSubmitting(false);
      });
      rp.open();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

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
      `}</style>

      {/* Razorpay checkout script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRzpReady(true)}
      />

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
                MEDITATION · LEVEL 01
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#6A6A5E" }}>
              A 10-hour guided course over 8 days · Online or at our Rishikesh ashram
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
            Reserve Your Seat &nbsp;·&nbsp; from ₹8,000
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

      {/* ============ CHECKOUT / PAYMENT ============ */}
      <section
        ref={bookingRef}
        style={{ width: "100%", maxWidth: 1160, scrollMarginTop: 88 }}
      >
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          style={{
            position: "relative",
            background: "#EEE7D3",
            border: "1px solid #E3D9C0",
            borderRadius: 28,
            overflow: "hidden",
            padding: 40,
          }}
        >
          {/* FORM */}
          <div style={{ position: "relative" }}>
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
              Reserve your seat
            </div>
            <h2
              style={{
                margin: "0 0 22px",
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 40,
                lineHeight: 1,
                letterSpacing: "-0.5px",
              }}
            >
              Book Meditation · Level 01
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}>
                Full name
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Your name"
                  style={input}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="+91 ..."
                  style={input}
                />
              </label>
              <label
                className="sm:col-span-2"
                style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}
              >
                Email
                <input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@email.com"
                  style={input}
                />
              </label>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: "#6A6A5E", margin: "22px 0 9px" }}>
              Where are you joining from?
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setResidency("india")} style={tab(residency !== "abroad")}>
                India · ₹8,000
              </button>
              <button type="button" onClick={() => setResidency("abroad")} style={tab(residency === "abroad")}>
                Outside India · ₹12,000
              </button>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: "#6A6A5E", margin: "22px 0 9px" }}>
              How would you like to attend?
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setMode("offline")} style={tab(mode === "offline")}>
                Offline · Ashram
              </button>
              <button type="button" onClick={() => setMode("online")} style={tab(mode === "online")}>
                Online · Live
              </button>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: "#6A6A5E", margin: "22px 0 9px" }}>
              Preferred slot
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setSlot("morning")} style={tab(slot === "morning")}>
                Morning
              </button>
              <button type="button" onClick={() => setSlot("evening")} style={tab(slot === "evening")}>
                Evening
              </button>
            </div>
          </div>

          {/* SUMMARY / PAY */}
          <div
            style={{
              position: "relative",
              background: "#FBF6E9",
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 50px -32px rgba(70,69,62,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {paid ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 14,
                  padding: "22px 4px",
                }}
              >
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: "50%",
                    background: "#C97A45",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    color: "#FBF6E9",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 30 }}>
                  Seat reserved
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: "#6A6A5E", lineHeight: 1.55 }}>
                  Thank you{nameGreeting}. Your spot for <b>Meditation · Level 01</b> is confirmed.
                  We&apos;ll WhatsApp your joining details for <b>{modeLabel}</b> · <b>{slotLabel}</b> slot
                  shortly.
                </p>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: "#C97A45" }}>
                  Namaste 🙏
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C" }}>
                  Order summary
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#6A6A5E" }}>
                  <span>Meditation · Level 01</span>
                  <span style={{ fontWeight: 600, color: "#46453E" }}>{priceLabel}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9a9280" }}>
                  <span>{resLabel} · {modeLabel}</span>
                  <span>8 days</span>
                </div>
                <div style={{ height: 1, background: "#E7DEC6" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: "#46453E" }}>
                    {priceLabel}
                  </span>
                </div>

                {errorMsg && (
                  <div
                    style={{
                      fontSize: 13,
                      color: "#B23B2E",
                      background: "#FBEAE6",
                      border: "1px solid #F1C9C1",
                      borderRadius: 10,
                      padding: "10px 12px",
                      lineHeight: 1.5,
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePay}
                  disabled={submitting}
                  className="mm-lift"
                  style={{
                    border: "none",
                    cursor: submitting ? "wait" : "pointer",
                    background: "#C97A45",
                    color: "#FBF6E9",
                    fontWeight: 600,
                    fontSize: 17,
                    padding: 16,
                    borderRadius: 14,
                    boxShadow: "0 14px 30px -14px rgba(201,122,69,0.9)",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting
                    ? "Processing…"
                    : rzpReady
                      ? `Pay ${priceLabel} securely`
                      : "Loading secure checkout…"}
                </button>
                <div style={{ textAlign: "center", fontSize: 12, color: "#A99F86" }}>
                  🔒 UPI · Cards · Netbanking · Powered by Razorpay
                </div>
              </>
            )}
          </div>
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
