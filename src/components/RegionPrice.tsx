"use client";

import { formatINR } from "@/lib/constants";
import { priceFor } from "@/lib/region";
import { useRegion } from "@/lib/useRegion";

/* Renders a course price for the visitor's region — Indian price in India,
   foreign price elsewhere. No comparison is ever shown; each visitor sees a
   single figure. */

export default function RegionPrice({
  inr,
  foreignInr,
  suffix = "",
}: {
  inr: number;
  foreignInr?: number;
  suffix?: string;
}) {
  const region = useRegion();
  const amount = priceFor({ priceINR: inr, priceForeignINR: foreignInr }, region);
  return (
    <>
      {formatINR(amount)}
      {suffix}
    </>
  );
}
