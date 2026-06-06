/**
 * Thin layer over Clerk that lets the rest of the app treat auth as optional.
 *
 * In dev (no CLERK_* env vars) every helper returns "not configured" /
 * unauthenticated and pages render a placeholder. As soon as the keys are
 * filled in, seekers can sign in, enroll, and see their dashboard.
 */

import { COURSES } from "@/lib/constants";

export type SeekerProfile = {
  city?: string;
  preferredPath?: "ashtanga-yoga" | "bhakti-yoga" | "jnana-yoga" | "advaita-vedanta" | "all" | "";
  whyISeek?: string;
};

export type SeekerMetadata = SeekerProfile & {
  enrolledPrograms?: string[];
};

export function isClerkConfigured() {
  return (
    !!process.env.CLERK_SECRET_KEY &&
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}

export type SeekerSummary = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  email: string | null;
  imageUrl: string | null;
  metadata: SeekerMetadata;
  enrolledCourses: typeof COURSES;
};

export async function getSeeker(): Promise<SeekerSummary | null> {
  if (!isClerkConfigured()) return null;
  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  if (!user) return null;

  const metadata = (user.publicMetadata ?? {}) as SeekerMetadata;
  const enrolledSlugs = metadata.enrolledPrograms ?? [];
  const enrolledCourses = COURSES.filter((c) => enrolledSlugs.includes(c.slug));

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  const email = user.primaryEmailAddress?.emailAddress ?? null;

  return {
    userId: user.id,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    fullName: fullName || email || "Sādhak",
    email,
    imageUrl: user.imageUrl ?? null,
    metadata,
    enrolledCourses,
  };
}

export async function getSeekerUserId(): Promise<string | null> {
  if (!isClerkConfigured()) return null;
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  return userId ?? null;
}

export async function enrollCurrentSeeker(slug: string): Promise<boolean> {
  if (!isClerkConfigured()) return false;
  const { auth, clerkClient } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return false;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing =
    (user.publicMetadata as SeekerMetadata).enrolledPrograms ?? [];
  if (existing.includes(slug)) return true;

  const next = [...existing, slug];
  await client.users.updateUser(userId, {
    publicMetadata: { ...user.publicMetadata, enrolledPrograms: next },
  });
  return true;
}

export async function updateSeekerProfile(profile: SeekerProfile) {
  if (!isClerkConfigured()) return false;
  const { auth, clerkClient } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return false;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const current = (user.publicMetadata ?? {}) as SeekerMetadata;
  await client.users.updateUser(userId, {
    publicMetadata: {
      ...current,
      city: profile.city ?? current.city ?? "",
      preferredPath: profile.preferredPath ?? current.preferredPath ?? "",
      whyISeek: profile.whyISeek ?? current.whyISeek ?? "",
    },
  });
  return true;
}

/* Admins — Team members and Guruji who may post official Updates.
   Comma-separated emails in ADMIN_EMAILS. */
export async function isAdmin(): Promise<boolean> {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return false;
  const seeker = await getSeeker();
  if (!seeker?.email) return false;
  return allowed.includes(seeker.email.toLowerCase());
}

/* Enrolled seekers — have bought at least one course (their journey has begun). */
export async function isEnrolledSeeker(): Promise<boolean> {
  const seeker = await getSeeker();
  return !!seeker && seeker.enrolledCourses.length > 0;
}

/* Newsletters readers: enrolled seekers and the team. */
export async function canReadNewsletters(): Promise<boolean> {
  const seeker = await getSeeker();
  if (!seeker) return false;
  if (seeker.enrolledCourses.length > 0) return true;
  return isAdmin();
}
