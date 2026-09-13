"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toggleRsvp, toggleSave } from "./actions";

export default function EventActions({
  eventId,
  isSignedIn,
  isRsvped,
  isSaved,
  rsvpCount,
}: {
  eventId: string;
  isSignedIn: boolean;
  isRsvped: boolean;
  isSaved: boolean;
  rsvpCount: number;
}) {
  const [isPending, startTransition] = useTransition();

  if (!isSignedIn) {
    return (
      <Link
        href="/login"
        className="inline-block text-sm text-neutral-500 underline"
      >
        Sign in to RSVP or save this event
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => { toggleRsvp(eventId); })}
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          isRsvped
            ? "bg-neutral-200 dark:bg-neutral-800"
            : "bg-black text-white dark:bg-white dark:text-black"
        }`}
      >
        {isRsvped ? "Going ✓" : "RSVP"}
      </button>

      <button
        disabled={isPending}
        onClick={() => startTransition(() => { toggleSave(eventId); })}
        className="rounded-lg px-4 py-2 text-sm font-medium bg-neutral-200 dark:bg-neutral-800"
      >
        {isSaved ? "Saved ✓" : "Save"}
      </button>

      <span className="text-sm text-neutral-500">{rsvpCount} going</span>
    </div>
  );
}
