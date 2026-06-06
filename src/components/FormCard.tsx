import { Mail, MessageCircle } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

/* The contact-card chrome — "Say namaste", email pill, OR divider —
   shared by every form on the site. */

export default function FormCard({
  title = "Say namaste",
  subtitle = "Tell us what brings you",
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="flex flex-col gap-4 rounded-2xl bg-paper p-4 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.25)] ring-1 ring-ink/5 sm:rounded-3xl sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {title}
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
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 text-green-700 transition-opacity hover:opacity-80"
            >
              <MessageCircle size={13} />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-soft/50 text-ink transition-opacity hover:opacity-80"
            >
              <Mail size={13} />
            </a>
          </div>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-sm font-medium text-ink-faint">OR</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <p className="text-sm font-medium text-ink">{subtitle}</p>

        {children}
      </div>
    </div>
  );
}
