import { NextResponse } from "next/server";
import { regionFromCountry } from "@/lib/region";

/* Tells the client which pricing region the visitor is in, based on Vercel's
   edge geo header. Also drops a short-lived cookie so repeat page loads
   resolve instantly without another round-trip. */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const country = req.headers.get("x-vercel-ip-country");
  const region = regionFromCountry(country);
  const res = NextResponse.json({ region });
  res.cookies.set("mm_region", region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
  return res;
}
