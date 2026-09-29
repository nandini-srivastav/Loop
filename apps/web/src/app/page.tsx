import { createClient } from "@/lib/supabase/server";
import EventFeed from "./EventFeed";
import RecommendedEvents from "./RecommendedEvents";
import Link from "next/link";
import { signOut } from "./actions/auth";

export default async function Home() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <h1 className="text-2xl font-semibold">Loop</h1>
        <div className="flex items-center gap-4">
          <Link href="/board" className="text-sm text-neutral-500">
            Board
          </Link>
          <Link href="/marketplace" className="text-sm text-neutral-500">
            Marketplace
          </Link>
          <Link href="/submit" className="text-sm text-neutral-500">
            Post event
          </Link>
          <Link href="/my-events" className="text-sm text-neutral-500">
            My events
          </Link>
          {user ? (
            <form action={signOut} className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">{user.email}</span>
              <button type="submit" className="text-sm underline text-neutral-500">
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm underline text-neutral-500">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">
          Couldn&apos;t load events: {error.message}
        </p>
      )}

      {!error && user && <RecommendedEvents userId={user.id} />}
      {!error && <EventFeed events={events ?? []} />}
    </main>
  );
}
