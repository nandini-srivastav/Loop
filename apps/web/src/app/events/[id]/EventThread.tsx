"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_anonymous: boolean;
  username?: string | null;
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
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  async function attachUsername(msg: Message): Promise<Message> {
    if (msg.is_anonymous) return { ...msg, username: null };
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", msg.user_id)
      .maybeSingle();
    return { ...msg, username: data?.username ?? null };
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));

    supabase
      .from("event_messages")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true })
      .then(async ({ data }) => {
        const withUsernames = await Promise.all((data ?? []).map(attachUsername));
        setMessages(withUsernames);
      });

    const channel = supabase
      .channel(`event-${eventId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "event_messages", filter: `event_id=eq.${eventId}` },
        async (payload) => {
          const withUsername = await attachUsername(payload.new as Message);
          setMessages((prev) => [...prev, withUsername]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      is_anonymous: isAnonymous,
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
            <div className="mb-1">
              {m.is_anonymous || !m.username ? (
                <span className="font-semibold text-xs" style={{ color: "#B78CFF" }}>
                  Anonymous
                </span>
              ) : (
                <Link
                  href={`/profile/${m.username}`}
                  className="font-semibold text-xs underline"
                  style={{ color: "#FF5C7A" }}
                >
                  {m.username}
                </Link>
              )}
            </div>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {isSignedIn ? (
        <form onSubmit={sendMessage} className="flex flex-col gap-2">
          <div className="flex gap-2">
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
          </div>
          <label className="flex items-center gap-1.5 text-sm text-neutral-500">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Send anonymously
          </label>
        </form>
      ) : (
        <Link href="/login" className="text-sm text-neutral-500 underline">
          Sign in to join the discussion.
        </Link>
      )}
    </div>
  );
}
