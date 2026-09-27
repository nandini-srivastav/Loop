import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewListingForm from "./NewListingForm";

export default async function NewListing() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/marketplace" className="text-sm text-neutral-500 mb-6 block">
        Back to marketplace
      </Link>
      <h1 className="text-2xl font-semibold mb-6">List an item</h1>
      <NewListingForm />
    </main>
  );
}
