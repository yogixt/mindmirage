import type { Metadata } from "next";
import { getSeekerUserId } from "@/lib/auth";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const signedIn = !!(await getSeekerUserId());
  return <CheckoutClient signedIn={signedIn} />;
}
