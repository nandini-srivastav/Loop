"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Conversation = {
  id: string;
  username: string;
  avatarUrl: string | null;
  lastMessage: string;
  lastAt: string;
  unread: number;
};

const AVATAR_COLORS = ["#FF5C7A", "#FFC24B", "#35D6A8", "#6EC1FF", "#B78CFF"];

function avatarColor(username: string) {
  const idx = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function Avatar({
  username,
  avatarUrl,
  size,
}: {
  username: string;
  avatarUrl: string | null;
  size: number;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={username}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: avatarColor(username), fontSize: size * 0.4 }}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

export default function MessagesList({ conversations }: { conversations: Conversation[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    return conversations.filter((c) =>
      c.username.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [conversations, query]);

  const recentFew = conversations.slice(0, 8);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search conversations..."
        className="w-full border border-neutral-200 rounded-full px-4 py-2.5 text-sm bg-white mb-5"
      />

      {recentFew.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-5">
          {recentFew.map((c) => (
            <Link
              key={c.id}
              href={`/messages/${c.username}`}
              className="flex flex-col items-center gap-1 flex-shrink-0"
            >
              <div className="relative">
                <Avatar username={c.username} avatarUrl={c.avatarUrl} size={56} />
                {c.unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: "#FF5C7A" }}
                  >
                    {c.unread}
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-500 max-w-[60px] truncate">
                {c.username}
              </span>
            </Link>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-neutral-500">
          {conversations.length === 0
            ? "No conversations yet — follow someone and have them follow you back to start chatting."
            : "No conversations match that search."}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/messages/${c.username}`}
            className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl p-4 card-hover"
          >
            <Avatar username={c.username} avatarUrl={c.avatarUrl} size={44} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ color: "#FF5C7A" }}>
                {c.username}
              </p>
              <p className="text-sm text-neutral-500 truncate">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && (
              <span
                className="text-white text-xs rounded-full px-2 py-0.5 flex-shrink-0"
                style={{ backgroundColor: "#FF5C7A" }}
              >
                {c.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
