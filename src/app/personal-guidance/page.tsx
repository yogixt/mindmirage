import { redirect } from "next/navigation";

/* Guidance now lives under "Sit with Guruji" — preserved as a redirect
   because the old URL is indexed and linked from WhatsApp messages. */
export default function PersonalGuidancePage() {
  redirect("/sit-with-guruji");
}
