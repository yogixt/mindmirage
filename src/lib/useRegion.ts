"use client";

import { useEffect, useState } from "react";
import type { Region } from "./region";

/* Client hook resolving the visitor's pricing region. Server render and first
   client paint always use "IN" (so static HTML and hydration match and the
   canonical price stays Indian); a cookie or one-time /api/region fetch then
   corrects it for visitors outside India. */

let cached: Region | null = null;
let inflight: Promise<Region> | null = null;

function readCookie(): Region | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)mm_region=(IN|INTL)/);
  return (m?.[1] as Region) ?? null;
}

function resolve(): Promise<Region> {
  if (cached) return Promise.resolve(cached);
  const fromCookie = readCookie();
  if (fromCookie) {
    cached = fromCookie;
    return Promise.resolve(fromCookie);
  }
  if (inflight) return inflight;
  inflight = fetch("/api/region")
    .then((r) => r.json())
    .then((d) => {
      cached = (d.region as Region) ?? "IN";
      return cached;
    })
    .catch(() => "IN" as Region);
  return inflight;
}

export function useRegion(): Region {
  const [region, setRegion] = useState<Region>("IN");
  useEffect(() => {
    let alive = true;
    resolve().then((r) => {
      if (alive) setRegion(r);
    });
    return () => {
      alive = false;
    };
  }, []);
  return region;
}
