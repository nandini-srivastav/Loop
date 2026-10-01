import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MessagesList from "./MessagesList";

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

  const conversationMap = new Map<
    string,
    { lastMessage: string; lastAt: string; unread: number }
  >();

  for (const m of messages ?? []) {
    const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, {
        lastMessage: m.content,
        lastAt: m.created_at,
        unread: 0,
      });
    }
    if (m.recipient_id === user.id && !m.read) {
      conversationMap.get(otherId)!.unread += 1;
    }
  }

  const otherIds = Array.from(conversationMap.keys());
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .in("id", otherIds.length > 0 ? otherIds : ["00000000-0000-0000-0000-000000000000"]);

  const rows = otherIds
    .map((id) => ({
      id,
      username: profiles?.find((p) => p.id === id)?.username ?? "unknown",
      avatarUrl: profiles?.find((p) => p.id === id)?.avatar_url ?? null,
      ...conversationMap.get(id)!,
    }))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

  return (
    <main className="min-h-screen p-6">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-6">Messages</h1>
        <MessagesList conversations={rows} />
      </div>
    </main>
  );
}
