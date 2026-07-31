/* Region-aware pricing. Visitors in India see the Indian price; everyone
   else sees the foreign price. Detection is by Vercel's edge geo header
   (x-vercel-ip-country); the charged amount is always recomputed server-side
   from that header so it can't be tampered with from the browser. */

export type Region = "IN" | "INTL";

/** India → "IN"; any other (or unknown) country → default. Unknown defaults
   to "IN" (our home market) so bots/VPNs never see the higher price. */
export function regionFromCountry(country?: string | null): Region {
  if (!country) return "IN";
  return country.toUpperCase() === "IN" ? "IN" : "INTL";
}

/** The price to charge/show for a course given the visitor's region.
   Falls back to the Indian price when no foreign price is set. */
export function priceFor(
  c: { priceINR: number; priceForeignINR?: number },
  region: Region,
): number {
  return region === "INTL" && c.priceForeignINR ? c.priceForeignINR : c.priceINR;
}
