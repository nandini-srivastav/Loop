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
      <div className="flex flex-col gap-3">
        {filtered.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block rounded-xl p-4 border-l-4 bg-neutral-100 dark:bg-neutral-900"
            style={{ borderLeftColor: CATEGORY_COLORS[event.category] ?? "#999" }}
          >
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {getCategories(event).join(" · ")}
            </span>
            <h3 className="font-semibold mt-1">{event.title}</h3>
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
        ))}
      </div>
    </div>
  );
}
