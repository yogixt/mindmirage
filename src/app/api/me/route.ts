import { NextResponse } from "next/server";
import { auth } from "@/auth";

/* Lightweight session probe for client components (navbar). */
export async function GET() {
  const session = await auth().catch(() => null);
  if (!session?.user) return NextResponse.json({ signedIn: false });
  return NextResponse.json({
    signedIn: true,
    name: session.user.name ?? "",
    image: session.user.image ?? null,
  });
}
