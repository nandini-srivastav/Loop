import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import IngestForm from "./IngestForm";

export default async function Ingest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/admin" className="text-sm text-neutral-500 mb-6 block">
        Back to admin
      </Link>
      <h1 className="text-2xl font-semibold mb-1">Ingest event</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Paste raw event text — an LLM structures it, checks for duplicates, and queues it for approval.
      </p>
      <IngestForm />
    </main>
  );
}
