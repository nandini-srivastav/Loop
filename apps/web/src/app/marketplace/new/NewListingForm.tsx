"use client";

import { useActionState, useState } from "react";
import { createListing } from "../actions";

const CATEGORIES = ["textbooks", "clothing", "electronics", "notes", "other"];

export default function NewListingForm() {
  const [state, formAction, isPending] = useActionState(createListing, null);
  const [priceType, setPriceType] = useState("fixed");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-neutral-500 mb-1">Title</label>
        <input
          name="title"
          type="text"
          required
          placeholder="Lab coat, size M"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Condition, pickup location, anything a buyer should know"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Category</label>
        <select
          name="category"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-white dark:bg-black">
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Type</label>
        <select
          name="price_type"
          value={priceType}
          onChange={(e) => setPriceType(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        >
          <option value="fixed" className="bg-white dark:bg-black">For sale</option>
          <option value="free" className="bg-white dark:bg-black">Free</option>
          <option value="loan" className="bg-white dark:bg-black">For loan</option>
        </select>
      </div>

      {priceType === "fixed" && (
        <div>
          <label className="block text-sm text-neutral-500 mb-1">Price ($)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="15.00"
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Photo (optional)</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="w-full text-sm"
        />
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 font-medium"
      >
        {isPending ? "Posting..." : "List item"}
      </button>
    </form>
  );
}
