import { redirect } from "next/navigation";

/* Updates became the Newsletters feed. */
export default function UpdatesRedirect() {
  redirect("/newsletters");
}
