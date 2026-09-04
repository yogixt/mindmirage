import { notFound, redirect } from "next/navigation";
import { CATALOG } from "@/lib/constants";
import { getSeeker } from "@/lib/auth";
import BookWizard from "@/components/BookWizard";

export const metadata = {
  title: "Book your session, Mind Mirage",
};

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = CATALOG.find((c) => c.slug === slug);
  if (!item || item.priceINR <= 0) {
    notFound();
  }

  const seeker = await getSeeker();
  const signedIn = !!seeker;

  if (!signedIn) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(`/book/${slug}`)}`);
  }

  return (
    <main className="min-h-screen bg-paper px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <BookWizard
          item={item}
          signedIn={signedIn}
          user={
            seeker
              ? {
                  name: seeker.fullName,
                  email: seeker.email ?? "",
                  phone: seeker.metadata.phone ?? "",
                }
              : null
          }
        />
      </div>
    </main>
  );
}
