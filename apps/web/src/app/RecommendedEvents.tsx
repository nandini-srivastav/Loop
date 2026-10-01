import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  society: "#FF5C7A",
  careers: "#FFC24B",
  cultural: "#35D6A8",
  academic: "#6EC1FF",
  sport: "#B78CFF",
};

function getCategories(event: { category: string; categories?: string[] | null }): string[] {
  return event.categories && event.categories.length > 0
    ? event.categories
    : [event.category];
}

export default async function RecommendedEvents({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: pastRsvps } = await supabase
    .from("rsvps")
    .select("event_id, events(category, categories)")
    .eq("user_id", userId);

  if (!pastRsvps || pastRsvps.length === 0) {
    return null;
  }

  const categoryCounts: Record<string, number> = {};
  const rsvpedEventIds = new Set<string>();

  pastRsvps.forEach((r) => {
    rsvpedEventIds.add(r.event_id);
    const event = Array.isArray(r.events) ? r.events[0] : r.events;
    if (event) {
      getCategories(event).forEach((c) => {
        categoryCounts[c] = (categoryCounts[c] || 0) + 1;
      });
    }
  });

  const maxCount = Math.max(...Object.values(categoryCounts));
  const topCategories = Object.entries(categoryCounts)
    .filter(([, count]) => count === maxCount)
    .map(([cat]) => cat);

  const { data: allUpcoming } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  const filtered = (allUpcoming ?? [])
    .filter((e) => !rsvpedEventIds.has(e.id))
    .filter((e) => getCategories(e).some((c) => topCategories.includes(c)))
    .slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
        Recommended for you
      </h2>
      <p className="text-xs text-neutral-500 mb-3">
        Because you&apos;ve RSVPed to {topCategories.join(" / ")} events before
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event, i) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="relative block rounded-xl border-l-4 bg-white border border-neutral-200 card-hover animate-fade-in-up"
            style={{
              borderLeftColor: CATEGORY_COLORS[event.category] ?? "#999",
              animationDelay: `${i * 40}ms`,
            }}
          >
            {event.image_url ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-t-xl"
                />
                <span
                  className="absolute top-2 left-2 text-xs font-semibold uppercase tracking-wide text-white rounded-full px-2.5 py-1"
                  style={{ backgroundColor: CATEGORY_COLORS[event.category] ?? "#999" }}
                >
                  {getCategories(event).join(" · ")}
                </span>
              </div>
            ) : (
              <span
                className="inline-block text-xs font-semibold uppercase tracking-wide text-white rounded-full px-2.5 py-1 mt-4 ml-4"
                style={{ backgroundColor: CATEGORY_COLORS[event.category] ?? "#999" }}
              >
                {getCategories(event).join(" · ")}
              </span>
            )}
            <div className="p-4">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
