import { redirect } from "next/navigation";

/* The Q&A moved to /ask; official posts live at /updates. */
export default function JournalRedirect() {
  redirect("/ask");
}
