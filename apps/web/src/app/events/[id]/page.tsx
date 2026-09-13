import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventActions from "./EventActions";

export default async function EventDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("status", "approved")
    .single();

  if (!event) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: rsvpCount } = await supabase
    .from("rsvps")
    .select("id", { count: "exact", head: true })
    .eq("event_id", id);

  let isRsvped = false;
  let isSaved = false;

  if (user) {
    const { data: rsvp } = await supabase
      .from("rsvps")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    isRsvped = !!rsvp;

    const { data: saved } = await supabase
      .from("saved_events")
      .select("id")
      .eq("event_id", id)
      .eq("user_id", user.id)
      .maybeSingle();
    isSaved = !!saved;
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    event.venue_address
  )}`;

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>

      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        {event.category}
      </span>
      <h1 className="text-2xl font-semibold mt-1 mb-2">{event.title}</h1>

      <p className="text-neutral-500 mb-1">
        {new Date(event.start_time).toLocaleString("en-AU", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
      <p className="text-neutral-500 mb-6">{event.venue_name}</p>

      {event.description && (
        <p className="mb-6 whitespace-pre-wrap">{event.description}</p>
      )}

      {event.organiser && (
        <p className="text-sm text-neutral-500 mb-6">
          Organised by {event.organiser}
        </p>
      )}

      <div className="mb-6">
        <EventActions
          eventId={event.id}
          isSignedIn={!!user}
          isRsvped={isRsvped}
          isSaved={isSaved}
          rsvpCount={rsvpCount ?? 0}
        />
      </div>

      <a
        href={`/events/${event.id}/calendar`}
        className="inline-block bg-neutral-200 dark:bg-neutral-800 rounded-lg px-4 py-2 text-sm font-medium mr-3"
      >
        Add to calendar
      </a>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium"
      >
        Get directions
      </a>
    </main>
  );
}
