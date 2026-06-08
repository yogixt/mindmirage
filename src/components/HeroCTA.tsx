"use client";

import { useState } from "react";
import Link from "next/link";
import VideoModal from "./VideoModal";

function WatchDemoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-2.5 rounded-full border border-ink/15 bg-paper/80 px-6 py-3 text-sm font-medium text-ink shadow-sm backdrop-blur transition-all hover:border-saffron/30 hover:bg-paper hover:shadow-md hover:shadow-saffron/10"
    >
      <span className="grid size-7 place-items-center rounded-full bg-saffron text-white shadow-sm transition-transform group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="size-3.5 translate-x-0.5" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      Watch demo
    </button>
  );
}

export default function HeroCTA() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <div className="animate-fade-rise-delay-3 opacity-0 mt-6 flex flex-wrap items-center justify-center gap-4">
        <WatchDemoButton onClick={() => setVideoOpen(true)} />
        <Link
          href="#offerings"
          className="text-xs uppercase tracking-[0.25em] text-ink-faint transition-colors hover:text-ink"
        >
          ↓ scroll
        </Link>
      </div>
      <VideoModal
        src="/video/mind-mirage-demo.mp4"
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
      />
    </>
  );
}
