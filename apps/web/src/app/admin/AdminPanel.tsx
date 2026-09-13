"use client";

import { useState, useTransition } from "react";
import { approveEvent, rejectEvent, setVerifiedOrganiser } from "./actions";

type PendingEvent = {
  id: string;
  title: string;
  category: string;
  start_time: string;
  venue_name: string;
  organiser: string | null;
  created_by: string;
};

export default function AdminPanel({ events }: { events: PendingEvent[] }) {
  const [isPending, startTransition] = useTransition();
  const [societyInputs, setSocietyInputs] = useState<Record<string, string>>({});

  return (
    <div className="flex flex-col gap-4">
      {events.length === 0 && (
        <p className="text-neutral-500">No pending events right now.</p>
      )}

      {events.map((event) => (
        <div
          key={event.id}
          className="rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900"
        >
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            {event.category}
          </span>
          <h3 className="font-semibold text-lg mt-1">{event.title}</h3>
          <p className="text-sm text-neutral-500 mt-1">
            {new Date(event.start_time).toLocaleString("en-AU")} ·{" "}
            {event.venue_name}
          </p>
          {event.organiser && (
            <p className="text-sm text-neutral-500">By {event.organiser}</p>
          )}
          <p className="text-xs text-neutral-400 mt-1 break-all">
            Submitted by user: {event.created_by}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              disabled={isPending}
              onClick={() => startTransition(() => approveEvent(event.id))}
              className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Approve
            </button>
            <button
              disabled={isPending}
              onClick={() => startTransition(() => rejectEvent(event.id))}
              className="bg-neutral-200 dark:bg-neutral-800 rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              Reject
            </button>
          </div>

          <div className="flex gap-2 mt-3 items-center">
            <input
              type="text"
              placeholder="Society name to verify as organiser"
              value={societyInputs[event.id] ?? ""}
              onChange={(e) =>
                setSocietyInputs((prev) => ({ ...prev, [event.id]: e.target.value }))
              }
              className="border rounded-lg px-2 py-1 text-sm bg-transparent flex-1"
            />
            <button
              disabled={isPending || !societyInputs[event.id]}
              onClick={() =>
                startTransition(() =>
                  setVerifiedOrganiser(event.created_by, societyInputs[event.id])
                )
              }
              className="bg-neutral-200 dark:bg-neutral-800 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap"
            >
              Verify organiser
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
