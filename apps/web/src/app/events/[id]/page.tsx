import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EventActions from "./EventActions";
import EventThread from "./EventThread";

const CATEGORY_COLORS: Record<string, string> = {
  society: "#FF5C7A",
  careers: "#FFC24B",
  cultural: "#35D6A8",
  academic: "#6EC1FF",
  sport: "#B78CFF",
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  society: "linear-gradient(135deg, #FF5C7A 0%, #B78CFF 100%)",
  careers: "linear-gradient(135deg, #FFC24B 0%, #FF5C7A 100%)",
  cultural: "linear-gradient(135deg, #35D6A8 0%, #6EC1FF 100%)",
  academic: "linear-gradient(135deg, #6EC1FF 0%, #B78CFF 100%)",
  sport: "linear-gradient(135deg, #B78CFF 0%, #FF5C7A 100%)",
};

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

  const { data: posterProfile } = await supabase
    .from("profiles")
    .select("is_verified_organiser, verified_society_name")
    .eq("id", event.created_by)
    .maybeSingle();

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

  const categories = event.categories?.length ? event.categories : [event.category];
  const accent = CATEGORY_COLORS[event.category] ?? "#FF5C7A";
  const gradient = CATEGORY_GRADIENTS[event.category] ?? CATEGORY_GRADIENTS.society;
  const organiserInitial = (event.organiser || "L").charAt(0).toUpperCase();

  return (
    <main className="min-h-screen p-6">
      <div className="w-full">
        <div
          className="relative rounded-2xl overflow-hidden mb-4"
          style={{ height: "260px", background: event.image_url ? undefined : gradient }}
        >
          {event.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <Link
            href="/"
            aria-label="Back to feed"
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg shadow"
          >
            ←
          </Link>
          <span
            className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-wide text-white rounded-full px-3 py-1"
            style={{ backgroundColor: accent }}
          >
            {categories.join(" · ")}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>

        {event.organiser && (
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
              style={{ backgroundColor: accent }}
            >
              {organiserInitial}
            </div>
            <span className="text-sm text-neutral-500">
              Organised by {event.organiser}
            </span>
            {posterProfile?.is_verified_organiser && (
              <span
                title={`Verified: ${posterProfile.verified_society_name ?? "organiser"}`}
                className="text-emerald-500 text-sm"
              >
                ✓
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-4 py-2 text-sm">
            📅{" "}
            {new Date(event.start_time).toLocaleString("en-AU", {
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-4 py-2 text-sm">
            📍 {event.venue_name}
          </span>
        </div>

        {event.description && (
          <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-6">
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
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

        <div className="flex flex-wrap gap-3 mb-8">
          <a
            href={`/events/${event.id}/calendar`}
            className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-4 py-2 text-sm font-medium btn-press"
          >
            🗓️ Add to calendar
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 rounded-full px-4 py-2 text-sm font-medium btn-press"
          >
            🧭 Get directions
          </a>
        </div>

        <EventThread eventId={event.id} isSignedIn={!!user} />
      </div>
    </main>
  );
}
