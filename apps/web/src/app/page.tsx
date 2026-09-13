import { createClient } from "@/lib/supabase/server";
import EventFeed from "./EventFeed";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Loop</h1>
        <div className="flex items-center gap-4">
          <Link href="/submit" className="text-sm text-neutral-500">
            Post event
          </Link>
          <Link href="/my-events" className="text-sm text-neutral-500">
            My events
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">
          Couldn&apos;t load events: {error.message}
        </p>
      )}

      {!error && <EventFeed events={events ?? []} />}
    </main>
  );
}
