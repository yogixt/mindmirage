"use client";

import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/lib/constants";

/* ────────────────────────────────────────────────────────────
   Iyengar Yoga — landing + reservation (no online payment).
   Mirrors the Meditation page's layout and warm palette so the two
   event pages feel identical; only the content and the booking
   action differ (Yoga reserves + connects on WhatsApp).
   Fonts are provided as CSS variables by app/yoga/page.tsx.
   ──────────────────────────────────────────────────────────── */

const SERIF = "var(--font-cormorant), var(--font-noto-deva), Georgia, serif";
const BODY = "var(--font-mukta), var(--font-noto-deva), system-ui, sans-serif";

const FACTS = [
  { big: "05 Jul", small: "Regular classes begin" },
  { big: "2–4 PM", small: "Daily class timing" },
  { big: "2", small: "Modes · Online & Ashram" },
  { big: "All", small: "Levels welcome" },
];

const AUDIENCES = ["Beginners", "All ages", "All levels"];

const INCLUSIONS = [
  "Warm Up & Breathing Practices",
  "Precise Asana in the Iyengar Method",
  "Props for Alignment, belts, blocks & bolsters",
  "Flexibility & Strength Building",
  "Pranayama",
  "Relaxation & Meditation",
  "Detailed Alignment Guidance",
  "Personal Attention",
];

const BENEFITS = [
  { hi: "तनाव में कमी और मानसिक शांति", en: "Less stress, more calm" },
  { hi: "लचीलापन और शारीरिक मजबूती", en: "Flexibility & physical strength" },
  { hi: "श्वास नियंत्रण और ऊर्जा संतुलन", en: "Breath control & energy balance" },
  { hi: "बेहतर स्वास्थ्य और रोग प्रतिरोधकता", en: "Better health & immunity" },
  { hi: "आंतरिक संतुलन और समग्र कल्याण", en: "Inner balance & holistic wellbeing" },
];

type Mode = "offline" | "online";
type Exp = "new" | "some" | "regular";

const EXP_LABEL: Record<Exp, string> = {
  new: "New to yoga",
  some: "Some experience",
  regular: "Regular practice",
};

export default function YogaBanner() {
  const [mode, setMode] = useState<Mode>("offline");
  const [exp, setExp] = useState<Exp>("new");
  const [reserved, setReserved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [heroImgOk, setHeroImgOk] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const bookingRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setHeroImgOk(true);
    img.src = "/yoga/yoga-hero.jpg";
  }, []);

  const setField = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const modeLabel = mode === "offline" ? "Offline · Ashram" : "Online · Live";
  const expLabel = EXP_LABEL[exp];
  const nameGreeting = form.name ? ", " + form.name.split(" ")[0] : "";

  const waHref = whatsappLink(
    `Namaste! I'd like to join the Iyengar Yoga (${modeLabel} · ${expLabel})${
      form.name ? `, I'm ${form.name.split(" ")[0]}` : ""
    }. Please share the fee and how to confirm my spot.`,
  );

  // choice pill (mode / experience) — matches the Meditation page
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

  async function handleReserve() {
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
    setSubmitting(true);
    try {
      const res = await fetch("/api/yoga/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, mode, experience: exp }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || `Reservation failed (${res.status}).`);
      setReserved(true);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function logWhatsAppClick(context: string) {
    try {
      const payload = JSON.stringify({
        program: "yoga",
        name: form.name,
        email: form.email,
        phone: form.phone,
        context,
      });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/whatsapp/click", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/whatsapp/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      /* never block the WhatsApp hand-off */
    }
  }

  return (
    <div
      className="mm-yoga"
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
      <style>{`
        .mm-yoga input:focus, .mm-yoga select:focus { outline: none; border-color: #C97A45 !important; }
        .mm-yoga input::placeholder { color: #A99F86; }
        .mm-lift { transition: transform .15s ease; }
        .mm-lift:hover { transform: translateY(-2px); }
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
            src="/yoga/yoga-hero.jpg"
            alt="Iyengar Yoga, Mind Mirage India"
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
              gap: 10,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "3px", textTransform: "uppercase", color: "#C97A45" }}>
              Mind Mirage India · Rishikesh
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontStyle: "italic", fontSize: "clamp(40px, 7vw, 72px)", lineHeight: 1, color: "#46453E" }}>
              Iyengar Yoga
            </div>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: "clamp(18px, 2.6vw, 26px)", letterSpacing: "2px", color: "#C97A45" }}>
              योग आसन
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(16px, 2.4vw, 22px)", color: "#6A6A5E", marginTop: 4 }}>
              Alignment · Precision · Balance
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
              <span style={{ fontFamily: SERIF, fontWeight: 600, fontStyle: "italic", fontSize: 34, lineHeight: 1, color: "#46453E" }}>
                योग
              </span>
              <span style={{ display: "inline-block", background: "transparent", border: "1.5px solid #C97A45", color: "#C97A45", fontWeight: 600, fontSize: 12, letterSpacing: "2.5px", padding: "6px 14px", borderRadius: 100 }}>
                IYENGAR YOGA · CLASSES
              </span>
            </div>
            <div style={{ fontSize: 16, color: "#6A6A5E" }}>
              Regular classes · 2–4 PM · Online or at our Rishikesh ashram
            </div>
          </div>
          <button
            type="button"
            onClick={() => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="mm-lift"
            style={{ border: "none", cursor: "pointer", background: "#C97A45", color: "#FBF6E9", fontWeight: 600, fontSize: 16, letterSpacing: "0.3px", padding: "15px 28px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 14px 30px -14px rgba(201,122,69,0.9)", whiteSpace: "nowrap" }}
          >
            Reserve Your Spot &nbsp;·&nbsp; Starts 05 July
            <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      </section>

      {/* ============ AUDIENCE PILLS ============ */}
      <section style={{ width: "100%", maxWidth: 1160, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 28, color: "#46453E" }}>Yoga for every body</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {AUDIENCES.map((a) => (
            <div key={a} style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 100, padding: "10px 24px", fontWeight: 600, fontSize: 15, color: "#46453E" }}>
              {a}
            </div>
          ))}
        </div>
      </section>

      {/* ============ FACTS RIBBON ============ */}
      <section className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4" style={{ maxWidth: 1160 }}>
        {FACTS.map((fact) => (
          <div key={fact.small} style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 34, color: "#C97A45", lineHeight: 1 }}>{fact.big}</div>
            <div style={{ fontWeight: 500, fontSize: 14, color: "#6A6A5E" }}>{fact.small}</div>
          </div>
        ))}
      </section>

      {/* ============ WHAT'S INCLUDED ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ background: "#EEE7D3", border: "1px solid #E3D9C0", borderRadius: 28, padding: "40px 44px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C97A45", marginBottom: 6 }}>What&apos;s included</div>
            <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>Everything a full practice needs</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-11 md:grid-cols-2">
            {INCLUSIONS.map((inc) => (
              <div key={inc} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid #E3D9C0" }}>
                <span style={{ color: "#C97A45", fontSize: 11 }}>◆</span>
                <span style={{ fontWeight: 500, fontSize: 16, color: "#46453E", flex: 1 }}>{inc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section style={{ width: "100%", maxWidth: 1160 }}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C97A45", marginBottom: 6 }}>Benefits</div>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>What regular practice brings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {BENEFITS.map((b) => (
            <div key={b.en} style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: "22px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#E7E9DB", display: "flex", alignItems: "center", justifyContent: "center", color: "#8C9E7C", fontSize: 12 }}>◆</span>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#46453E", lineHeight: 1.4 }}>{b.en}</div>
              <div style={{ fontSize: 12.5, color: "#9a9280", lineHeight: 1.6 }}>{b.hi}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ RESERVATION ============ */}
      <section ref={bookingRef} style={{ width: "100%", maxWidth: 1160, scrollMarginTop: 88 }}>
        <div
          className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          style={{ position: "relative", background: "#EEE7D3", border: "1px solid #E3D9C0", borderRadius: 28, overflow: "hidden", padding: 40 }}
        >
          {/* FORM */}
          <div style={{ position: "relative" }}>
            <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C97A45", marginBottom: 6 }}>Reserve your spot</div>
            <h2 style={{ margin: "0 0 22px", fontFamily: SERIF, fontWeight: 700, fontSize: 40, lineHeight: 1, letterSpacing: "-0.5px" }}>Join Iyengar Yoga</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}>
                Full name
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Your name" style={input} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}>
                Phone
                <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+91 ..." style={input} />
              </label>
              <label className="sm:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 7, fontWeight: 600, fontSize: 13, color: "#6A6A5E" }}>
                Email
                <input value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@email.com" style={input} />
              </label>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: "#6A6A5E", margin: "22px 0 9px" }}>How would you like to attend?</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setMode("offline")} style={tab(mode === "offline")}>Offline · Ashram</button>
              <button type="button" onClick={() => setMode("online")} style={tab(mode === "online")}>Online · Live</button>
            </div>

            <div style={{ fontWeight: 600, fontSize: 13, color: "#6A6A5E", margin: "22px 0 9px" }}>Your experience</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={() => setExp("new")} style={tab(exp === "new")}>New to yoga</button>
              <button type="button" onClick={() => setExp("some")} style={tab(exp === "some")}>Some experience</button>
              <button type="button" onClick={() => setExp("regular")} style={tab(exp === "regular")}>Regular practice</button>
            </div>
          </div>

          {/* SUMMARY */}
          <div style={{ position: "relative", background: "#FBF6E9", borderRadius: 22, padding: 28, boxShadow: "0 20px 50px -32px rgba(70,69,62,0.5)", display: "flex", flexDirection: "column", gap: 14 }}>
            {reserved ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "22px 4px" }}>
                <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#C97A45", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, color: "#FBF6E9" }}>✓</div>
                <h3 style={{ margin: 0, fontFamily: SERIF, fontWeight: 700, fontSize: 30 }}>Spot reserved</h3>
                <p style={{ margin: 0, fontSize: 15, color: "#6A6A5E", lineHeight: 1.55 }}>
                  Thank you{nameGreeting}. We&apos;ve saved your place in <b>Iyengar Yoga</b> ({modeLabel}).
                  Our team will WhatsApp you the fee &amp; payment details and confirm your start on <b>05 July</b>.
                </p>
                <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 22, color: "#C97A45" }}>Namaste 🙏</div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => logWhatsAppClick("success")}
                  className="mm-lift"
                  style={{ marginTop: 2, background: "#25D366", color: "#FFFFFF", fontWeight: 600, fontSize: 15, padding: "12px 22px", borderRadius: 12, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  Message us on WhatsApp →
                </a>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C" }}>Your reservation</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "#6A6A5E" }}>
                  <span>Iyengar Yoga</span><span style={{ fontWeight: 600, color: "#46453E" }}>{expLabel}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9a9280" }}>
                  <span>Starts 05 July</span><span>2:00–4:00 PM</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9a9280" }}>
                  <span>{modeLabel}</span><span>{expLabel}</span>
                </div>
                <div style={{ height: 1, background: "#E7DEC6" }} />
                <div style={{ background: "#F6EFDD", border: "1px solid #E7DEC6", borderRadius: 14, padding: "14px 16px", fontSize: 14, color: "#6A6A5E", lineHeight: 1.5 }}>
                  The class fee is shared over WhatsApp, reserve now and our team will connect with you to confirm your spot.
                </div>

                {errorMsg && (
                  <div style={{ fontSize: 13, color: "#B23B2E", background: "#FBEAE6", border: "1px solid #F1C9C1", borderRadius: 10, padding: "10px 12px", lineHeight: 1.5 }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleReserve}
                  disabled={submitting}
                  className="mm-lift"
                  style={{ border: "none", cursor: submitting ? "wait" : "pointer", background: "#C97A45", color: "#FBF6E9", fontWeight: 600, fontSize: 17, padding: 16, borderRadius: 14, boxShadow: "0 14px 30px -14px rgba(201,122,69,0.9)", opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? "Reserving…" : "Reserve my spot"}
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  onClick={() => logWhatsAppClick("reserve-summary")}
                  style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#128C7E", textDecoration: "none" }}
                >
                  Prefer to ask first? Chat with us on WhatsApp →
                </a>
                <div style={{ textAlign: "center", fontSize: 12, color: "#A99F86" }}>No payment now · We&apos;ll contact you to confirm</div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ============ VENUE / CONTACT ============ */}
      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-[1fr_1.2fr_1fr]" style={{ maxWidth: 1160 }}>
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>Class timing</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E", marginBottom: 4 }}>2:00 – 4:00 PM</div>
          <div style={{ fontSize: 15, color: "#6A6A5E", lineHeight: 1.5 }}>Regular classes · Offline at the ashram or Online (live)</div>
        </div>
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>Venue</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E", lineHeight: 1.15, marginBottom: 6 }}>Advaita Sādhanā Kuṭīr Ashram</div>
          <div style={{ fontSize: 15, color: "#6A6A5E", lineHeight: 1.5 }}>
            Nirmal Block B, Water Tank Road, Rishikesh
            <br />
            <span style={{ fontSize: 13, color: "#9a9280" }}>अद्वैत साधना कुटीर · ऋषिकेश</span>
          </div>
        </div>
        <div style={{ background: "#FBF6E9", border: "1px solid #E7DEC6", borderRadius: 18, padding: 26 }}>
          <div style={{ fontWeight: 600, fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "#8C9E7C", marginBottom: 10 }}>Contact &amp; booking</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 24, color: "#46453E", marginBottom: 4 }}>+91 72492 84401</div>
          <a href="https://mindmirageindia.com/" target="_blank" rel="noreferrer noopener" style={{ fontSize: 15, color: "#C97A45", textDecoration: "none", fontWeight: 600 }}>mindmirageindia.com</a>
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
