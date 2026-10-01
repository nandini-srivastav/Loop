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
        className={`rounded-full px-6 py-3 text-sm font-semibold btn-press ${
          isRsvped ? "bg-neutral-900 text-white" : "btn-gradient shadow-lg"
        }`}
      >
        {isRsvped ? "Going ✓" : "RSVP"}
      </button>

      <button
        disabled={isPending}
        onClick={() => startTransition(() => { toggleSave(eventId); })}
        aria-label={isSaved ? "Remove from saved" : "Save event"}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg btn-press border ${
          isSaved
            ? "bg-red-50 border-red-200 text-red-500"
            : "bg-white border-neutral-200 text-neutral-400"
        }`}
      >
        {isSaved ? "♥" : "♡"}
      </button>

      <span className="text-sm text-neutral-500">{rsvpCount} going</span>
    </div>
  );
}
