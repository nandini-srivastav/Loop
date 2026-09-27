"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
};

export default function EventThread({
  eventId,
  isSignedIn,
}: {
  eventId: string;
  isSignedIn: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));

    supabase
      .from("event_messages")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "event_messages", filter: `event_id=eq.${eventId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !userId) return;

    await supabase.from("event_messages").insert({
      event_id: eventId,
      user_id: userId,
      content: content.trim(),
    });
    setContent("");
  }

  return (
    <div className="mt-8">
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-3">
        Discussion
      </h2>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto mb-3">
        {messages.length === 0 && (
          <p className="text-neutral-500 text-sm">
            No messages yet — be the first to say something.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-neutral-100 dark:bg-neutral-900 rounded-lg px-3 py-2 text-sm"
          >
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {isSignedIn ? (
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Say something..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-transparent"
          />
          <button
            type="submit"
            className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium"
          >
            Send
          </button>
        </form>
      ) : (
        <p className="text-sm text-neutral-500">Sign in to join the discussion.</p>
      )}
    </div>
  );
}
