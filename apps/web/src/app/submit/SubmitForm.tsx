"use client";

import { useActionState } from "react";
import { submitEvent } from "./actions";

const CATEGORIES = ["society", "careers", "cultural", "academic", "sport"];

export default function SubmitForm() {
  const [state, formAction, isPending] = useActionState(submitEvent, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Event title
        </label>
        <input
          name="title"
          type="text"
          required
          placeholder="Inter-cultural dance night"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Category
        </label>
        <select
          name="category"
          required
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-white dark:bg-black">
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">Date</label>
          <input
            name="date"
            type="date"
            required
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">Time</label>
          <input
            name="time"
            type="time"
            required
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Venue name
        </label>
        <input
          name="venue_name"
          type="text"
          required
          placeholder="Great Court"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Venue address
        </label>
        <input
          name="venue_address"
          type="text"
          required
          placeholder="Great Court, University of Queensland, St Lucia QLD 4072"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
        <p className="text-xs text-neutral-500 mt-1">
          Used for the &quot;get directions&quot; link — be specific.
        </p>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Organiser
        </label>
        <input
          name="organiser"
          type="text"
          placeholder="e.g. Cultural Society"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="What's happening, who's it for, anything to bring?"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      {state?.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 font-medium"
      >
        {isPending ? "Submitting..." : "Submit for review"}
      </button>
    </form>
  );
}
