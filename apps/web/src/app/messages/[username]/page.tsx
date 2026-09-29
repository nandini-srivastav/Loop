import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import DMThread from "./DMThread";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: otherProfile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("username", username)
    .maybeSingle();

  if (!otherProfile) {
    notFound();
  }

  const { data: iFollow } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("followee_id", otherProfile.id)
    .maybeSingle();

  const { data: theyFollow } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", otherProfile.id)
    .eq("followee_id", user.id)
    .maybeSingle();

  const isMutual = !!iFollow && !!theyFollow;

  if (!isMutual) {
    return (
      <main className="min-h-screen p-6 max-w-5xl mx-auto">
        <Link href={`/profile/${username}`} className="text-sm text-neutral-500 mb-6 block">
          Back to profile
        </Link>
        <p className="text-neutral-500">
          You can only message someone once you both follow each other.
        </p>
      </main>
    );
  }

  return (
    <main className="h-screen flex flex-col p-4">
      <div className="flex items-center gap-4 mb-3 flex-shrink-0">
        <Link href="/messages" className="text-sm text-neutral-500">
          ← Messages
        </Link>
        <Link href={`/profile/${username}`} className="text-sm underline" style={{ color: "#FF5C7A" }}>
          @{username}
        </Link>
      </div>
      <DMThread currentUserId={user.id} otherUserId={otherProfile.id} />
    </main>
  );
}
