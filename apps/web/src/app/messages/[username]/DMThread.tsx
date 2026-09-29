"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  recipient_id: string;
  read: boolean;
};

export default function DMThread({
  currentUserId,
  otherUserId,
}: {
  currentUserId: string;
  otherUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`
      )
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setMessages(data ?? []);
        supabase
          .from("direct_messages")
          .update({ read: true })
          .eq("sender_id", otherUserId)
          .eq("recipient_id", currentUserId)
          .eq("read", false)
          .then();
      });

    const channel = supabase
      .channel(`dm-${[currentUserId, otherUserId].sort().join("-")}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "direct_messages" },
        (payload) => {
          const m = payload.new as Message;
          const belongsHere =
            (m.sender_id === currentUserId && m.recipient_id === otherUserId) ||
            (m.sender_id === otherUserId && m.recipient_id === currentUserId);
          if (belongsHere) {
            setMessages((prev) => [...prev, m]);
            if (m.recipient_id === currentUserId) {
              supabase.from("direct_messages").update({ read: true }).eq("id", m.id).then();
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "direct_messages" },
        (payload) => {
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, read: updated.read } : m))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, otherUserId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const { error } = await supabase.from("direct_messages").insert({
      sender_id: currentUserId,
      recipient_id: otherUserId,
      content: content.trim(),
    });

    if (!error) {
      setContent("");
    }
  }

  const lastMineIndex = [...messages].map((m) => m.sender_id).lastIndexOf(currentUserId);

  return (
    <div className="flex flex-col flex-1 min-h-0 border rounded-xl">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        {messages.length === 0 && (
          <p className="text-neutral-500 text-sm">No messages yet — say hi.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={m.id}
            className="flex flex-col"
            style={{ alignItems: m.sender_id === currentUserId ? "flex-end" : "flex-start" }}
          >
            <div
              className={`rounded-lg px-3 py-2 text-sm max-w-[70%] ${
                m.sender_id === currentUserId
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 dark:bg-neutral-900"
              }`}
            >
              {m.content}
            </div>
            {m.sender_id === currentUserId && i === lastMineIndex && m.read && (
              <span className="text-xs text-neutral-500 mt-0.5 mr-1">Seen</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm bg-transparent"
        />
        <button
          type="submit"
          className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium"
        >
          Send
        </button>
      </form>
    </div>
  );
}
