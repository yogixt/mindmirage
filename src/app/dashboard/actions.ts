"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { updateSeekerProfile } from "@/lib/auth";

const ProfileSchema = z.object({
  city: z.string().max(120).optional().default(""),
  preferredPath: z.enum(["yoga", "vedanta", "both", ""]).optional().default(""),
  whyISeek: z.string().max(800).optional().default(""),
});

export type ProfileFormState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; message: string };

export async function saveProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = ProfileSchema.safeParse({
    city: formData.get("city"),
    preferredPath: formData.get("preferredPath"),
    whyISeek: formData.get("whyISeek"),
  });
  if (!parsed.success) {
    return { status: "error", message: "Please check your entries." };
  }
  const ok = await updateSeekerProfile(parsed.data);
  if (!ok) return { status: "error", message: "Could not save just now." };
  revalidatePath("/dashboard");
  return { status: "ok" };
}
