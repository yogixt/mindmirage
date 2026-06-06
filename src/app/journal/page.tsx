import { redirect } from "next/navigation";

/* Old journal URL — official posts live at /updates; questions at /faq. */
export default function JournalRedirect() {
  redirect("/faq");
}
