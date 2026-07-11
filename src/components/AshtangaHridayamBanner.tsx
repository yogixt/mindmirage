"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/* ────────────────────────────────────────────────────────────
   Ashtanga Hridayam · Sutrasthana — course landing + booking /
   payment. Ayurveda "core scripture series" identity: deep
   forest green, temple gold and cream (Cormorant Garamond +
   Mukta). Self-contained palette so the section keeps its own
   look inside the site chrome (Navbar / Footer). Fonts arrive as
   CSS variables from app/ashtanga-hridayam/page.tsx.
   ──────────────────────────────────────────────────────────── */

const SERIF = "var(--font-cormorant), var(--font-noto-deva), Georgia, serif";
const BODY = "var(--font-mukta), var(--font-noto-deva), system-ui, sans-serif";

const GREEN = "#14432E";
const GREEN_SOFT = "#2E5B44";
const GOLD = "#B0862A";
const CREAM = "#F4EEDF";
const CREAM_CARD = "#FBF6E9";
const INK = "#2F3A2B";
const MUTED = "#6B6A54";
const BORDER = "#E3DBC1";

const FACTS = [
  { big: "40", small: "Minutes per session" },
  { big: "3×", small: "Days a week · flexible" },
  { big: "2", small: "Months · full series" },
  { big: "₹8k", small: "Course fee" },
];

const BENEFITS = [
  { en: "Read Aṣṭāṅga Hṛdayam from the source", hi: "अष्टाङ्गहृदयम् — मूल ग्रन्थ से अध्ययन" },
  { en: "Grasp Ayurveda's core principles", hi: "आयुर्वेद के मूल सिद्धांतों की समझ" },
  { en: "Sanskrit ślokas with clear translation", hi: "संस्कृत श्लोक, सरल अनुवाद सहित" },
  { en: "Guided, unhurried study with the teacher", hi: "आचार्य के साथ सुव्यवस्थित अध्ययन" },
];

const INCLUSIONS = [
  { name: "Sūtrasthāna — studied chapter by chapter" },
  { name: "Śloka recitation & word-by-word meaning" },
  { name: "Dinacharyā & Ṛtucharyā — daily and seasonal regimen" },
  { name: "Doṣa, Dhātu & Mala — the body's fundamentals" },
  { name: "Dravya, Rasa, Guṇa, Vīrya & Vipāka" },
  { name: "Principles of health, disease and balance" },
  { name: "Live doubt-clearing sessions" },
  { name: "Session recordings for revision" },
  { name: "Offline in Rishikesh or Online via Zoom" },
  { name: "Certificate of completion", isNew: true },
];

type Mode = "offline" | "online";

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

const FEE = 8000;
const FEE_LABEL = "₹" + FEE.toLocaleString("en-IN");

export default function AshtangaHridayamBanner() {
  const [mode, setMode] = useState<Mode>("offline");
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rzpReady, setRzpReady] = useState(false);
  const [posterOk, setPosterOk] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setPosterOk(true);
    img.src = "/ashtanga/poster.jpg";
  }, []);

  useEffect(() => {
    if (getRazorpay()) setRzpReady(true);
  }, []);

  const bookingRef = useRef<HTMLElement | null>(null);

  const setField = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const modeLabel = mode === "offline" ? "Offline · Rishikesh" : "Online · Zoom";
  const nameGreeting = form.name ? ", " + form.name.split(" ")[0] : "";

  const tab = (active: boolean): React.CSSProperties => ({
    border: active ? "none" : `1px solid ${BORDER}`,
    cursor: "pointer",
    flex: 1,
    padding: "13px 10px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 14,
    transition: "all .15s ease",
    background: active ? GREEN : CREAM_CARD,
    color: active ? "#F6EFD8" : MUTED,
  });

  const input: React.CSSProperties = {
    border: `1.5px solid ${BORDER}`,
    background: CREAM_CARD,
    borderRadius: 12,
    padding: "13px 14px",
    fontSize: 15,
    color: INK,
    fontFamily: BODY,
    width: "100%",
  };

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
      const res = await fetch("/api/ashtanga/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, name, email, phone }),
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
        theme: { color: GREEN },
        handler: async (r) => {
          try {
            const vr = await fetch("/api/ashtanga/verify", {
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
                mode,
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

  const eyebrow = (color: string): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: 12,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color,
    marginBottom: 6,
  });

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontFamily: SERIF,
    fontWeight: 700,
    fontSize: 40,
    lineHeight: 1,
    color: INK,
  };

  return (
    <div
      className="mm-ashtanga"
      style={{
        fontFamily: BODY,
        background: CREAM,
        color: INK,
        padding: "32px 20px 64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      <style>{`
        .mm-ashtanga input:focus, .mm-ashtanga select:focus {
          outline: none; border-color: ${GREEN} !important;
        }
        .mm-ashtanga input::placeholder { color: #A99F86; }
        .mm-lift { transition: transform .15s ease; }
        .mm-lift:hover { transform: translateY(-2px); }
      `}</style>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRzpReady(true)}
      />

      {/* ============ HERO ============ */}
      <section
        className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        style={{
          maxWidth: 1160,
          background: "linear-gradient(135deg, #F8F2E2 0%, #EEE7CF 100%)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 30px 70px -42px rgba(20,67,46,0.5)",
          padding: 40,
          border: `1px solid ${BORDER}`,
        }}
      >
        {/* Text panel */}
        <div>
          <span
            style={{
              display: "inline-block",
              border: `1.5px solid ${GOLD}`,
              color: GOLD,
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: "2.5px",
              padding: "6px 14px",
              borderRadius: 100,
            }}
          >
            AYURVEDA CORE SCRIPTURE · SERIES 03
          </span>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 26,
              color: GOLD,
              marginTop: 18,
            }}
          >
            अष्टाङ्गहृदयम्
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: "clamp(40px, 6vw, 68px)",
              lineHeight: 1.02,
              color: GREEN,
              margin: "4px 0 0",
            }}
          >
            Ashtanga Hridayam
          </h1>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(20px, 3vw, 28px)",
              color: GREEN_SOFT,
              marginTop: 4,
            }}
          >
            Sutrasthāna — the heart of Ayurveda
          </div>
          <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.6, margin: "18px 0 0", maxWidth: 480 }}>
            An unhurried study of Ayurveda&apos;s foundational scripture — three
            sessions a week over two months, offline in Rishikesh or online on
            Zoom. Starts 15 July.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "20px 0 26px" }}>
            {["Starts 15 July", "3 days a week · 40 min", "Offline · Zoom available"].map((c) => (
              <span
                key={c}
                style={{
                  background: CREAM_CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 100,
                  padding: "8px 15px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: GREEN_SOFT,
                }}
              >
                {c}
              </span>
            ))}
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
              background: GREEN,
              color: "#F6EFD8",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "0.3px",
              padding: "15px 28px",
              borderRadius: 100,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 14px 30px -14px rgba(20,67,46,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            Reserve Your Seat &nbsp;·&nbsp; {FEE_LABEL}
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>

        {/* Poster */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {posterOk ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/ashtanga/poster.jpg"
              alt="Ashtanga Hridayam · Sutrasthana — Ayurveda Core Scripture Series, Rishikesh"
              style={{
                width: "100%",
                maxWidth: 380,
                borderRadius: 20,
                display: "block",
                boxShadow: "0 24px 60px -30px rgba(20,67,46,0.6)",
                border: `1px solid ${BORDER}`,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                maxWidth: 380,
                aspectRatio: "3 / 4",
                borderRadius: 20,
                background:
                  "radial-gradient(120% 120% at 50% 0%, #1E5A3C 0%, #14432E 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 28,
                gap: 10,
              }}
            >
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: GOLD }}>
                अष्टाङ्गहृदयम्
              </span>
              <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: "#F6EFD8", lineHeight: 1.1 }}>
                Ashtanga Hridayam
              </span>
              <span style={{ fontSize: 13, color: "#CBD8C6", letterSpacing: "1px" }}>
                Sutrasthāna Series
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ============ FACTS RIBBON ============ */}
      <section className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4" style={{ maxWidth: 1160 }}>
        {FACTS.map((fact) => (
          <div
            key={fact.small}
            style={{
              background: CREAM_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 18,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: GOLD, lineHeight: 1 }}>
              {fact.big}
            </div>
            <div style={{ fontWeight: 500, fontSize: 14, color: MUTED }}>{fact.small}</div>
          </div>
        ))}
      </section>

      {/* ============ BENEFITS ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={eyebrow(GOLD)}>What you gain</div>
          <h2 style={sectionTitle}>Ayurveda, from its root text</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div
              key={b.en}
              style={{
                background: CREAM_CARD,
                border: `1px solid ${BORDER}`,
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
                  background: "#E7EBDB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: GREEN_SOFT,
                  fontSize: 12,
                }}
              >
                ◆
              </span>
              <div style={{ fontWeight: 600, fontSize: 16, color: INK, lineHeight: 1.4 }}>{b.en}</div>
              <div style={{ fontSize: 13, color: "#9a9280", lineHeight: 1.6 }}>{b.hi}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ INCLUSIONS ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div
          style={{
            background: "#ECE7D2",
            border: `1px solid ${BORDER}`,
            borderRadius: 28,
            padding: "40px 44px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={eyebrow(GOLD)}>Inclusions</div>
            <h2 style={sectionTitle}>What the series covers</h2>
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
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <span style={{ color: GOLD, fontSize: 11 }}>◆</span>
                <span style={{ fontWeight: 500, fontSize: 16, color: INK, flex: 1 }}>{inc.name}</span>
                {inc.isNew && (
                  <span
                    style={{
                      background: GREEN_SOFT,
                      color: "#F6EFD8",
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

      {/* ============ DHANVANTARI MANTRA ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div
          style={{
            background: "linear-gradient(135deg, #14432E 0%, #1E5A3C 100%)",
            borderRadius: 28,
            padding: "40px 44px",
            textAlign: "center",
            color: "#F6EFD8",
          }}
        >
          <div style={{ ...eyebrow(GOLD), marginBottom: 14 }}>Dhanvantari Mantra</div>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(20px, 3vw, 27px)",
              lineHeight: 1.7,
              margin: 0,
              color: "#F6EFD8",
            }}
          >
            ॐ नमो भगवते वासुदेवाय धन्वंतरये
            <br />
            अमृतकलशहस्ताय सर्वामयविनाशनाय
            <br />
            त्रैलोक्यनाथाय श्रीमहाविष्णवे नमः॥
          </p>
          <p style={{ fontSize: 13, color: "#CBD8C6", lineHeight: 1.7, marginTop: 16, fontStyle: "italic" }}>
            Om Namo Bhagavate Vāsudevāya Dhanvantaraye Amṛta Kalaśa Hastāya
            <br />
            Sarva Āmaya Vināśanāya Trailokya Nāthāya Śrī Mahā Viṣṇave Namaḥ
          </p>
        </div>
      </section>

      {/* ============ CHECKOUT / PAYMENT ============ */}
      <section ref={bookingRef} style={{ width: "100%", maxWidth: 1160, scrollMarginTop: 88 }}>
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          style={{
            position: "relative",
            background: "#ECE7D2",
            border: `1px solid ${BORDER}`,
            borderRadius: 28,
            overflow: "hidden",
            padding: 40,
          }}
        >
          {/* FORM */}
          <div style={{ position: "relative" }}>
            <div style={eyebrow(GOLD)}>Reserve your seat</div>
            <h2 style={{ ...sectionTitle, margin: "0 0 22px", fontSize: 40, letterSpacing: "-0.5px" }}>
              Book Ashtanga Hridayam
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: MUTED }}>
                Full name
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" style={input} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: MUTED }}>
                Phone
                <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 ..." style={input} />
              </label>
              <label
                className="sm:col-span-2"
                style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: MUTED }}
              >
                Email
                <input value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@email.com" style={input} />
              </label>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: MUTED, margin: "22px 0 9px" }}>
              How would you like to attend?
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setMode("offline")} style={tab(mode === "offline")}>
                Offline · Rishikesh
              </button>
              <button type="button" onClick={() => setMode("online")} style={tab(mode === "online")}>
                Online · Zoom
              </button>
            </div>
          </div>

          {/* SUMMARY / PAY */}
          <div
            style={{
              position: "relative",
              background: CREAM_CARD,
              borderRadius: 22,
              padding: 28,
              boxShadow: "0 20px 50px -32px rgba(20,67,46,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {paid ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "22px 4px" }}>
                <div
                  style={{
                    width: 66,
                    height: 66,
                    borderRadius: "50%",
                    background: GREEN,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 34,
                    color: "#F6EFD8",
                  }}
                >
                  ✓
                </div>
                <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: INK }}>Seat reserved</h3>
                <p style={{ margin: 0, fontSize: 15, color: MUTED, lineHeight: 1.55 }}>
                  Thank you{nameGreeting}. Your place in <b>Ashtanga Hridayam · Sutrasthāna</b> is confirmed.
                  We&apos;ll WhatsApp your joining details for the <b>{modeLabel}</b> batch shortly.
                </p>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: GOLD }}>
                  Namaste 🙏
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: GREEN_SOFT }}>
                  Order summary
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: MUTED }}>
                  <span>Ashtanga Hridayam · Sutrasthāna</span>
                  <span style={{ fontWeight: 600, color: INK }}>{FEE_LABEL}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9a9280" }}>
                  <span>{modeLabel}</span>
                  <span>2 months</span>
                </div>
                <div style={{ height: 1, background: BORDER }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>Total</span>
                  <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: INK }}>{FEE_LABEL}</span>
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
                    background: GREEN,
                    color: "#F6EFD8",
                    fontWeight: 600,
                    fontSize: 17,
                    padding: 16,
                    borderRadius: 14,
                    boxShadow: "0 14px 30px -14px rgba(20,67,46,0.9)",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? "Processing…" : rzpReady ? `Pay ${FEE_LABEL} securely` : "Loading secure checkout…"}
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
      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_1.2fr_1fr]" style={{ maxWidth: 1160 }}>
        <div style={{ background: CREAM_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 26 }}>
          <div style={{ ...eyebrow(GREEN_SOFT), marginBottom: 10 }}>Schedule</div>
          <div style={{ fontSize: 16, color: INK, lineHeight: 1.5 }}>
            3 days a week · 40 minutes a session · flexible days · starts 15 July · 2-month series
          </div>
        </div>
        <div style={{ background: CREAM_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 26 }}>
          <div style={{ ...eyebrow(GREEN_SOFT), marginBottom: 10 }}>Venue</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: INK, lineHeight: 1.15, marginBottom: 6 }}>
            Advaita Sādhanā Kuṭīr Ashram
          </div>
          <div style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>
            Nirmal Block B, Rishikesh · Zoom available
            <br />
            <span style={{ fontSize: 13, color: "#9a9280" }}>अद्वैत साधना कुटीर · ऋषिकेश</span>
          </div>
        </div>
        <div style={{ background: CREAM_CARD, border: `1px solid ${BORDER}`, borderRadius: 18, padding: 26 }}>
          <div style={{ ...eyebrow(GREEN_SOFT), marginBottom: 10 }}>Contact</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: INK, marginBottom: 4 }}>
            +91 72492 84401
          </div>
          <a
            href="https://mindmirageindia.com/"
            target="_blank"
            rel="noreferrer noopener"
            style={{ fontSize: 15, color: GOLD, textDecoration: "none", fontWeight: 600 }}
          >
            mindmirageindia.com
          </a>
        </div>
      </section>

      {/* ============ TAGLINE ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ textAlign: "center", padding: "8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <span style={{ width: 56, height: 1, background: "#D9CFB0" }} />
            <span style={{ color: GOLD, fontSize: 12 }}>◆</span>
            <span style={{ width: 56, height: 1, background: "#D9CFB0" }} />
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: "clamp(24px, 4vw, 36px)", color: GREEN, marginTop: 16, lineHeight: 1.2 }}>
            The science of life, studied at its source
          </div>
          <div style={{ fontSize: 14, color: "#9a9280", marginTop: 8 }}>
            आयुर्वेद · जीवन का विज्ञान
          </div>
        </div>
      </section>
    </div>
  );
}
