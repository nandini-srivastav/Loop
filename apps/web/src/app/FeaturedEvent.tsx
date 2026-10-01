import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const CATEGORY_GRADIENTS: Record<string, string> = {
  society: "linear-gradient(135deg, #FF5C7A 0%, #B78CFF 100%)",
  careers: "linear-gradient(135deg, #FFC24B 0%, #FF5C7A 100%)",
  cultural: "linear-gradient(135deg, #35D6A8 0%, #6EC1FF 100%)",
  academic: "linear-gradient(135deg, #6EC1FF 0%, #B78CFF 100%)",
  sport: "linear-gradient(135deg, #B78CFF 0%, #FF5C7A 100%)",
};

export default async function FeaturedEvent() {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!event) return null;

  const gradient = CATEGORY_GRADIENTS[event.category] ?? CATEGORY_GRADIENTS.society;

  return (
    <Link
      href={`/events/${event.id}`}
      className="block relative rounded-2xl overflow-hidden mb-8 card-hover animate-fade-in-up"
      style={{ background: gradient, minHeight: "240px" }}
    >
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.image_url}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
      )}
      <div
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
      />
      <div className="relative p-8 flex flex-col justify-end h-full" style={{ minHeight: "240px" }}>
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-white/90 mb-2">
          🔥 Coming up next
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 drop-shadow-sm">
          {event.title}
        </h2>
        <p className="text-white/90 text-sm mb-4">
          {new Date(event.start_time).toLocaleString("en-AU", {
            weekday: "long",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
          })}
          {" · "}
          {event.venue_name}
        </p>
        <span className="inline-block bg-white text-black rounded-full px-5 py-2 text-sm font-semibold self-start btn-press shadow-lg">
          View event
        </span>
      </div>
    </Link>
  );
}
