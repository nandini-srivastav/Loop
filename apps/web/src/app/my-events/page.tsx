import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MyEvents() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: rsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("event_id, events(*)")
    .eq("user_id", user.id);

  const { data: saved, error: savedError } = await supabase
    .from("saved_events")
    .select("event_id, events(*)")
    .eq("user_id", user.id);

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>

      <h1 className="text-2xl font-semibold mb-6">My events</h1>

      {(rsvpsError || savedError) && (
        <p className="text-red-600 text-sm mb-6">
          Something went wrong loading your events. Try refreshing the page.
        </p>
      )}

      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
        Going
      </h2>
      {(!rsvps || rsvps.length === 0) && (
        <p className="text-neutral-500 mb-6">
          Nothing yet — RSVP to an event and it&apos;ll show up here.
        </p>
      )}
      <div className="flex flex-col gap-3 mb-8">
        {rsvps?.map((r) => {
          const event = Array.isArray(r.events) ? r.events[0] : r.events;
          if (!event) return null;
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">
                {new Date(event.start_time).toLocaleDateString("en-AU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                {event.venue_name}
              </p>
            </Link>
          );
        })}
      </div>

      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
        Saved
      </h2>
      {(!saved || saved.length === 0) && (
        <p className="text-neutral-500">
          Nothing saved yet — bookmark an event and it&apos;ll show up here.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {saved?.map((s) => {
          const event = Array.isArray(s.events) ? s.events[0] : s.events;
          if (!event) return null;
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="block rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">
                {new Date(event.start_time).toLocaleDateString("en-AU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                {event.venue_name}
              </p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
