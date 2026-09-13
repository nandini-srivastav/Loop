import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SubmitForm from "./SubmitForm";

export default async function Submit() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>
      <h1 className="text-2xl font-semibold mb-1">Post an event</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Takes under a minute. It&apos;ll show up once approved.
      </p>
      <SubmitForm />
    </main>
  );
}
