"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/constants";

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with Mind Mirage on WhatsApp"
      className={`fixed bottom-6 left-6 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lg shadow-black/15 transition-all hover:scale-[1.06] ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ transitionDuration: "600ms" }}
    >
      <svg viewBox="0 0 32 32" className="size-7 fill-current" aria-hidden>
        <path d="M16.001 3C9.373 3 4 8.373 4 15a11.92 11.92 0 0 0 1.715 6.156L4 29l8.063-1.682A11.94 11.94 0 0 0 16.001 27C22.627 27 28 21.627 28 15S22.627 3 16.001 3Zm0 21.6c-1.83 0-3.633-.49-5.21-1.42l-.373-.222-4.785.998 1.013-4.665-.243-.382A9.6 9.6 0 1 1 25.6 15c0 5.292-4.308 9.6-9.6 9.6Zm5.474-7.18c-.3-.15-1.776-.876-2.052-.977-.275-.1-.475-.15-.675.15s-.776.977-.95 1.176c-.176.2-.35.226-.65.075-.3-.15-1.265-.466-2.41-1.485-.89-.793-1.491-1.773-1.666-2.073-.175-.3-.018-.461.131-.611.135-.134.3-.35.45-.526.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.675-1.626-.925-2.226-.244-.585-.493-.506-.676-.516l-.575-.01c-.2 0-.525.075-.8.376-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.226 5.125 4.524.717.31 1.275.494 1.711.633.719.228 1.373.196 1.89.119.577-.086 1.776-.726 2.026-1.426.25-.7.25-1.3.176-1.426-.075-.125-.275-.2-.575-.35Z" />
      </svg>
    </a>
  );
}
