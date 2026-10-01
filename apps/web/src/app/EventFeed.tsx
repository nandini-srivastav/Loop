"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  society: "#FF5C7A",
  careers: "#FFC24B",
  cultural: "#35D6A8",
  academic: "#6EC1FF",
  sport: "#B78CFF",
};

const CATEGORIES = ["all", "society", "careers", "cultural", "academic", "sport"];

type Event = {
  id: string;
  title: string;
  category: string;
  categories?: string[];
  start_time: string;
  venue_name: string;
  image_url?: string | null;
};

function getCategories(event: Event): string[] {
  return event.categories && event.categories.length > 0
    ? event.categories
    : [event.category];
}

export default function EventFeed({ events }: { events: Event[] }) {
  const [category, setCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week">("all");

  const filtered = useMemo(() => {
    const now = new Date();
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return events.filter((event) => {
      if (category !== "all" && !getCategories(event).includes(category)) return false;

      const start = new Date(event.start_time);
      if (dateFilter === "today" && start > endOfToday) return false;
      if (dateFilter === "week" && start > endOfWeek) return false;

      return true;
    });
  }, [events, category, dateFilter]);

  return (
    <>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap capitalize ${
              category === c
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "today", "week"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDateFilter(d)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${
              dateFilter === d
                ? "bg-black text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {d === "all" ? "All dates" : d === "today" ? "Today" : "This week"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-neutral-500">
          Nothing matches right now — try a different category or check back soon.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event, i) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="relative block rounded-xl border-l-4 bg-white border border-neutral-200 card-hover animate-fade-in-up"
            style={{
              borderLeftColor: CATEGORY_COLORS[event.category] ?? "#999",
              animationDelay: `${Math.min(i, 8) * 40}ms`,
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
              <h2 className="font-semibold text-lg mt-1">{event.title}</h2>
              <p className="text-sm text-neutral-500 mt-1">
                {new Date(event.start_time).toLocaleString("en-AU", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })}
                {" · "}
                {event.venue_name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
