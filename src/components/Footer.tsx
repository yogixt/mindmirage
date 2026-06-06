import Link from "next/link";
import {
  NAV_FOOTER_ABOUT,
  NAV_FOOTER_ENGAGE,
  NAV_FOOTER_RESEARCH,
  NAV_FOOTER_SIT,
  SANSKRIT,
  SITE,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-paper-warm text-ink border-t border-ink/10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 pt-6 pb-5">
        {/* Mantra — one tight line */}
        <div className="text-center">
          <p className="deva text-lg text-gold">
            {SANSKRIT.closing.deva}
            <span className="sanskrit-italic ml-3 text-sm text-ink-soft">
              {SANSKRIT.closing.en}
            </span>
          </p>
        </div>

        {/* Columns */}
        <div className="mt-5 grid gap-x-6 gap-y-6 border-t border-ink/10 pt-5 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="display text-2xl text-ink">
              {SITE.name}
              <sup className="ml-0.5 text-[10px] text-ink-faint">®</sup>
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              A contemplative learning space rooted in the Advaita tradition of
              Adi Shankarācārya — Advaita Sādhanā Kuṭīr, Rishikesh.
            </p>
          </div>

          <FooterColumn
            title="Sit with Us"
            titleHref="/sit-with-guruji"
            color="text-saffron"
            links={NAV_FOOTER_SIT}
          />
          <FooterColumn title="About" color="text-green-700" links={NAV_FOOTER_ABOUT} />
          <FooterColumn title="Research" color="text-[#B8862B]" links={NAV_FOOTER_RESEARCH} />
          <FooterColumn title="Engage" color="text-red-700" links={NAV_FOOTER_ENGAGE} />
        </div>

        <div className="mt-5 grid gap-3 border-t border-ink/10 pt-4 sm:grid-cols-2 sm:items-center">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">
            © {new Date().getFullYear()} {SITE.name} · {SITE.location}
          </p>
          <div className="flex flex-wrap gap-5 sm:justify-end text-sm text-ink-soft">
            <a
              href={`mailto:${SITE.email}`}
              className="underline underline-offset-4 hover:text-ink"
            >
              {SITE.email}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 hover:text-ink"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  titleHref,
  color,
  links,
}: {
  title: string;
  titleHref?: string;
  color: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  const heading = (
    <h3 className={`text-xs font-bold uppercase tracking-[0.18em] ${color}`}>
      {title}
    </h3>
  );
  return (
    <div>
      {titleHref ? <Link href={titleHref}>{heading}</Link> : heading}
      <ul className="mt-2.5 space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm font-semibold text-ink transition-colors hover:text-saffron"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
