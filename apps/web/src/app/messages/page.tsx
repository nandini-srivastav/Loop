import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Inbox() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: messages } = await supabase
    .from("direct_messages")
    .select("*")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const conversations = new Map<
    string,
    { lastMessage: string; lastAt: string; unread: number }
  >();

  for (const m of messages ?? []) {
    const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    if (!conversations.has(otherId)) {
      conversations.set(otherId, {
        lastMessage: m.content,
        lastAt: m.created_at,
        unread: 0,
      });
    }
    if (m.recipient_id === user.id && !m.read) {
      conversations.get(otherId)!.unread += 1;
    }
  }

  const otherIds = Array.from(conversations.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", otherIds.length > 0 ? otherIds : ["00000000-0000-0000-0000-000000000000"]);

  const rows = otherIds
    .map((id) => ({
      id,
      username: profiles?.find((p) => p.id === id)?.username ?? "unknown",
      ...conversations.get(id)!,
    }))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-6">Messages</h1>

        {rows.length === 0 && (
          <p className="text-neutral-500">
            No conversations yet — follow someone and have them follow you back to start chatting.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <Link
              key={r.id}
              href={`/messages/${r.username}`}
              className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4"
            >
              <div>
                <p className="font-semibold" style={{ color: "#FF5C7A" }}>
                  {r.username}
                </p>
                <p className="text-sm text-neutral-500 truncate max-w-xs">{r.lastMessage}</p>
              </div>
              {r.unread > 0 && (
                <span className="bg-black text-white dark:bg-white dark:text-black text-xs rounded-full px-2 py-0.5">
                  {r.unread}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
