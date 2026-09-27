"use client";

import { useState } from "react";
import { sendListingMessage } from "../actions";

export default function ListingMessages({ listingId }: { listingId: string }) {
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await sendListingMessage(listingId, content);
    setContent("");
    setSent(true);
  }

  return (
    <form onSubmit={handleSend} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Hi, is this still available?"
        rows={2}
        className="border rounded-lg px-3 py-2 text-sm bg-transparent"
      />
      <button
        type="submit"
        className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium self-start"
      >
        Message seller
      </button>
      {sent && (
        <p className="text-sm text-emerald-500">Sent — the seller can see this in their account.</p>
      )}
    </form>
  );
}
