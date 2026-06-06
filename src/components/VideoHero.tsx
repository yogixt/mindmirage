"use client";

import { useEffect, useRef } from "react";
import { VIDEO_HERO_URL } from "@/lib/constants";

type Props = {
  src?: string;
  /** Vertical offset of the video element within the hero container. */
  topOffset?: string;
  /** Fullscreen background mode — video fills the whole hero section. */
  fullBleed?: boolean;
  poster?: string;
};

export default function VideoHero({
  src = VIDEO_HERO_URL,
  topOffset = "300px",
  fullBleed = false,
  poster,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Set muted/playsInline imperatively — mobile browsers require the
    // muted attribute at play time, and React's SSR markup can miss it.
    video.muted = true;
    video.playsInline = true;
    video.load();
    void video.play().catch(() => {});
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        webkit-playsinline="true"
        className="absolute object-cover"
        style={
          fullBleed
            ? {
                inset: 0,
                width: "100%",
                height: "100%",
                transform: "translateZ(0)",
                willChange: "transform",
              }
            : { top: topOffset, right: 0, bottom: 0, left: 0, width: "100%" }
        }
      />
    </div>
  );
}
