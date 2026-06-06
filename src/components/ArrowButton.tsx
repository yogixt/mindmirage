"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
};

/**
 * Pill button with a circular icon and an animated arrow on hover.
 * Style ported from a Uiverse component, re-themed to the earthy palette —
 * earth-brown pill + gold icon pocket (see .arrow-btn in globals.css).
 * Pass `href` to render as a Link, or `onClick` for a plain button.
 */
export default function ArrowButton({ href, onClick, children, className = "" }: Props) {
  const inner = (
    <>
      <span className="arrow-btn__text">{children}</span>
      <span className="arrow-btn__icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`arrow-btn ${className}`}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`arrow-btn ${className}`}>
      {inner}
    </button>
  );
}
