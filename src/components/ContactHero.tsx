"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { INQUIRY_SUBJECTS, SITE, whatsappLink } from "@/lib/constants";

/* Self-hosted 720p re-encode (~1.4 MB) — original is 44 MB. */
const VIDEO_URL = "/contact-720.mp4";
const POSTER = "/contact-poster.jpg";

export default function ContactHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    video.load();
    void video.play().catch(() => {});
  }, []);

  const toggle = (s: string) =>
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      country: String(fd.get("country") ?? ""),
      subject: selected.length ? selected.join(", ") : "General inquiry",
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "invalid_body"
          ? err.message
          : "Please check the fields and try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-ink/15 bg-transparent text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition";

  return (
    <div className="min-h-screen bg-paper p-3 pt-20 sm:p-4 sm:pt-22 md:p-6 md:pt-24">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[calc(100vh-104px)] md:min-h-[calc(100vh-120px)]">
        {/* Video background */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          webkit-playsinline="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

        {/* Content layer */}
        <div className="relative z-10 flex min-h-[calc(100vh-104px)] md:min-h-[calc(100vh-120px)] flex-col gap-6 p-4 sm:p-6 md:p-8">
          <div className="flex-1 min-h-[2rem]" />

          {/* Bottom row: headline + form card */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="shrink-0 text-3xl font-medium leading-tight text-white drop-shadow-lg sm:text-4xl xl:text-5xl lg:max-w-lg xl:max-w-2xl">
              Begin a quiet
              <br />
              <span
                className="display italic"
                style={{ fontWeight: 400 }}
              >
                conversation.
              </span>
            </p>

            {/* Form card */}
            <div className="w-full shrink-0 lg:w-[min(480px,45%)]">
              <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-paper p-4 shadow-2xl sm:rounded-3xl sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  Say namaste
                </h2>

                {/* Email + quick channels */}
                <div className="flex flex-row items-center justify-between gap-3 rounded-2xl bg-paper-deep/60 px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="text-[11px] text-ink-faint">Drop us a line</p>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="block truncate text-sm font-semibold text-saffron hover:underline"
                    >
                      {SITE.email}
                    </a>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <SocialBtn
                      href={whatsappLink()}
                      className="bg-green-100 text-green-700"
                      label="WhatsApp"
                    >
                      <MessageCircle size={13} />
                    </SocialBtn>
                    <SocialBtn
                      href={`mailto:${SITE.email}`}
                      className="bg-gold-soft/50 text-ink"
                      label="Email"
                    >
                      <Mail size={13} />
                    </SocialBtn>
                  </div>
                </div>

                {sent ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl text-green-700">
                      ✓
                    </div>
                    <p className="text-base font-semibold text-ink">
                      Your message has reached us.
                    </p>
                    <p className="text-sm text-ink-soft">
                      Acharya Ji or our team will reply within a day.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* OR divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-ink/10" />
                      <span className="text-sm font-medium text-ink-faint">OR</span>
                      <div className="h-px flex-1 bg-ink/10" />
                    </div>

                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                      <p className="text-sm font-medium text-ink">
                        Tell us what brings you
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input name="name" required minLength={2} placeholder="Full name" className={inputCls} autoComplete="name" />
                        <input name="email" required type="email" placeholder="Email" className={inputCls} autoComplete="email" />
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input name="whatsapp" type="tel" required pattern="\\+[1-9]\\d{4,14}" placeholder="+91 …" className={inputCls} />
                        <input name="country" required minLength={2} placeholder="Country" className={inputCls} autoComplete="country-name" />
                      </div>
                      <textarea
                        name="message"
                        required
                        minLength={2}
                        rows={3}
                        placeholder="Take your time. Speak as you would in a quiet room…"
                        className={`${inputCls} resize-none`}
                      />
                      <div>
                        <p className="text-sm font-medium text-ink">
                          I&apos;m writing about…
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {INQUIRY_SUBJECTS.map((s) => {
                            const active = selected.includes(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggle(s)}
                                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                                  active
                                    ? "border-ink bg-paper-deep text-ink"
                                    : "border-ink/15 bg-paper text-ink-soft hover:border-ink/40"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {error && <p className="text-xs text-saffron">{error}</p>}
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full rounded-2xl bg-saffron py-3 text-sm font-semibold text-white transition-colors hover:bg-clay disabled:opacity-60"
                      >
                        {sending ? "Sending…" : "Send my message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({
  href,
  className,
  label,
  children,
}: {
  href: string;
  className: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-xl transition-opacity hover:opacity-80 ${className}`}
    >
      {children}
    </a>
  );
}
