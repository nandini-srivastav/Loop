"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function UnreadBadge({ userId }: { userId: string }) {
  const [count, setCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function loadCount() {
      const { count: c } = await supabase
        .from("direct_messages")
        .select("id", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("read", false);
      setCount(c ?? 0);
    }

    loadCount();

    const channel = supabase
      .channel(`unread-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "direct_messages" },
        () => loadCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (count === 0) return null;

  return (
    <span
      className="ml-1 text-white text-xs rounded-full px-1.5"
      style={{ backgroundColor: "#FF5C7A" }}
    >
      {count}
    </span>
  );
}
