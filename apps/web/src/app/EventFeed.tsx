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
  start_time: string;
  venue_name: string;
};

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
      if (category !== "all" && event.category !== category) return false;

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
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
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
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            }`}
          >
            {d === "all" ? "All dates" : d === "today" ? "Today" : "This week"}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-neutral-500">No events match these filters.</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block rounded-xl p-4 border-l-4 bg-neutral-100 dark:bg-neutral-900"
            style={{ borderLeftColor: CATEGORY_COLORS[event.category] ?? "#999" }}
          >
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {event.category}
            </span>
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
          </Link>
        ))}
      </div>
    </>
  );
}
