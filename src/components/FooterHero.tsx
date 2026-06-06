"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  NAV_FOOTER_ABOUT,
  NAV_FOOTER_ENGAGE,
  NAV_FOOTER_LEARN,
  NAV_FOOTER_RESEARCH,
  SANSKRIT,
  SITE,
} from "@/lib/constants";

/* Self-hosted 720p re-encode (~0.8 MB) — the original CloudFront file is
   33 MB and never finishes loading on mobile connections. */
const VIDEO_URL = "/footer-720.mp4";
const POSTER = "/footer-poster.jpg";

/**
 * Footer — two-column split:
 *   Left  · looping video card ()
 *   Right · brand · link grid · mantra · copyright (sand card)
 * On mobile, the video stacks above the content.
 */
export default function FooterHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Mobile browsers need muted set imperatively at play time.
    video.muted = true;
    video.playsInline = true;
    const onCanPlay = () => {
      void video.play().catch(() => {});
    };
    video.addEventListener("canplay", onCanPlay, { once: true });
    video.load();
    void video.play().catch(() => {});
    return () => {
      video.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  return (
    <section className="w-full bg-paper-warm">
      <div className="grid lg:grid-cols-5">
        {/* ───────── LEFT · Video panel (small, edges blended into the sand) ───────── */}
        <div className="relative bg-paper-deep p-5 sm:p-6 lg:col-span-2 flex items-center">
          <div className="relative w-full overflow-hidden aspect-[16/10] lg:aspect-[4/3] lg:max-h-[360px]">
            <video
              ref={videoRef}
              src={VIDEO_URL}
              poster={POSTER}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disableRemotePlayback
              webkit-playsinline="true"
              x5-playsinline="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            {/* Soft bottom scrim for the caption */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/55 via-ink/15 to-transparent" />

            {/* Blended edges — each side fades into the surrounding sand tone */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-paper-deep to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-paper-deep to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-paper-deep to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper-deep to-transparent" />

            {/* Top-left eyebrow */}
            <div className="absolute left-5 top-5 flex items-center gap-2 border border-paper/30 bg-ink/25 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-paper backdrop-blur">
              <span className="size-1.5 bg-saffron" aria-hidden />
              Mangalāchārana
            </div>

            {/* Bottom caption */}
            <div className="absolute left-6 right-6 bottom-6">
              <p className="deva text-lg sm:text-xl text-paper">
                {SANSKRIT.closing.deva}
              </p>
              <p className="sanskrit-italic mt-1 text-sm text-paper/85">
                {SANSKRIT.closing.en}
              </p>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT · Written content ───────── */}
        <div className="relative overflow-hidden bg-paper-deep px-6 sm:px-10 py-8 sm:py-8 flex flex-col lg:col-span-3">
          {/* Brand badge */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="display text-2xl sm:text-3xl text-ink">
              {SITE.name}
              <sup className="ml-0.5 text-[10px] text-ink-faint">®</sup>
            </Link>
            <span className="inline-flex items-center gap-2 border border-ink/15 bg-paper px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
              <span className="size-1.5 bg-saffron" aria-hidden />
              Rishikesh · India
            </span>
          </div>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-ink-soft leading-relaxed">
            A contemplative learning space rooted in the Advaita tradition of
            Adi Shankarācārya — Advaita Sādhanā Kuṭīr, Rishikesh.
          </p>

          {/* Link grid */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-5 sm:grid-cols-4">
            <FooterColumn title="Learn" links={NAV_FOOTER_LEARN} />
            <FooterColumn title="About" links={NAV_FOOTER_ABOUT} />
            <FooterColumn title="Research" links={NAV_FOOTER_RESEARCH} />
            <FooterColumn title="Engage" links={NAV_FOOTER_ENGAGE} />
          </div>

          {/* Spacer pushes the copyright row to the bottom on tall screens */}
          <div className="flex-1" />

          {/* Copyright row */}
          <div className="mt-5 grid gap-4 border-t border-ink/15 pt-5 sm:grid-cols-2 sm:items-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              © {new Date().getFullYear()} {SITE.name} · {SITE.location}
            </p>
            <div className="flex flex-wrap gap-5 sm:justify-end text-sm text-ink-soft">
              <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                {SITE.email}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-ink"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.22em] text-saffron font-medium">
        {title}
      </h3>
      <ul className="mt-2.5 space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
