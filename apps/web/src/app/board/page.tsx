import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import InterestBoard from "./InterestBoard";

export default async function Board() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>
      <h1 className="text-2xl font-semibold mb-1">Board</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Find a partner, ask a question, or just say what&apos;s on your mind.
      </p>
      <InterestBoard isSignedIn={!!user} />
    </main>
  );
}
