"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoModal({
  src,
  poster,
  isOpen,
  onClose,
}: {
  src: string;
  poster?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      // Auto-play when opened
      setTimeout(() => videoRef.current?.play().catch(() => {}), 300);
    } else {
      document.body.style.overflow = "";
      videoRef.current?.pause();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-5xl px-6 transition-all duration-300 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-6 grid size-10 place-items-center rounded-full bg-paper/90 text-ink shadow-lg backdrop-blur transition-transform hover:scale-105"
          aria-label="Close video"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Video container */}
        <div className="overflow-hidden rounded-2xl bg-ink shadow-2xl ring-1 ring-white/10">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            controls
            className="w-full"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <p className="mt-3 text-center text-xs text-white/60">
          Press <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">ESC</kbd> to close
        </p>
      </div>
    </div>
  );
}
