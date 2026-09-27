"use client";

import { useTransition } from "react";
import { markListingStatus } from "../actions";

export default function MarkSoldButton({
  listingId,
  priceType,
}: {
  listingId: string;
  priceType: string;
}) {
  const [isPending, startTransition] = useTransition();
  const label = priceType === "loan" ? "loaned" : "sold";

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => { markListingStatus(listingId, label); })}
      className="bg-neutral-200 dark:bg-neutral-800 rounded-lg px-4 py-2 text-sm font-medium"
    >
      Mark as {label}
    </button>
  );
}
