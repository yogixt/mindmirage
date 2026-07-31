"use client";

import { whatsappLink } from "@/lib/constants";
import { useRegion } from "@/lib/useRegion";

/* Shown only to visitors detected as outside India: a discreet way for an
   Indian national living abroad to request Indian pricing. The team verifies
   over WhatsApp and shares an Indian-price payment link manually. Indian
   visitors never see this (they already get the Indian price). */

export default function IndianAbroadNote({ context = "" }: { context?: string }) {
  const region = useRegion();
  if (region !== "INTL") return null;

  const msg =
    `Namaste. I'm an Indian national currently abroad` +
    (context ? ` (interested in ${context})` : "") +
    ` and would like to pay the Indian price. Could you please share an Indian-price payment link?`;

  return (
    <p className="mt-3 text-center text-xs text-ink-faint">
      Indian national paying from abroad?{" "}
      <a
        href={whatsappLink(msg)}
        target="_blank"
        rel="noreferrer noopener"
        className="font-semibold text-saffron underline underline-offset-2 hover:text-clay"
      >
        Message us for Indian pricing →
      </a>
    </p>
  );
}
