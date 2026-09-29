import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import FollowButton from "./FollowButton";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwnProfile = user?.id === profile.id;

  let isFollowing = false;
  let isMutual = false;

  if (user && !isOwnProfile) {
    const { data: followingRow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("followee_id", profile.id)
      .maybeSingle();
    isFollowing = !!followingRow;

    const { data: followedByRow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", profile.id)
      .eq("followee_id", user.id)
      .maybeSingle();
    isMutual = isFollowing && !!followedByRow;
  }

  const { count: followerCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("followee_id", profile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", profile.id);

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>

      <div className="max-w-xl">
        <div className="flex items-center gap-4 mb-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          )}
          <div>
            <h1 className="text-xl font-semibold">@{profile.username}</h1>
            <p className="text-sm text-neutral-500">
              {followerCount ?? 0} followers · {followingCount ?? 0} following
            </p>
          </div>
        </div>

        {profile.bio && <p className="mb-4">{profile.bio}</p>}

        <div className="flex flex-col gap-1 text-sm text-neutral-500 mb-6">
          {profile.pursuing && <p>Studying: {profile.pursuing}</p>}
          {profile.age && <p>Age: {profile.age}</p>}
          {profile.gender && <p>Gender: {profile.gender}</p>}
          {profile.hobbies && <p>Hobbies: {profile.hobbies}</p>}
          {profile.is_verified_organiser && (
            <p className="text-emerald-500">
              ✓ Verified organiser — {profile.verified_society_name}
            </p>
          )}
        </div>

        {isOwnProfile ? (
          <Link
            href="/profile/edit"
            className="inline-block bg-neutral-200 dark:bg-neutral-800 rounded-lg px-4 py-2 text-sm font-medium"
          >
            Edit profile
          </Link>
        ) : user ? (
          <FollowButton
            profileUserId={profile.id}
            username={profile.username}
            isFollowing={isFollowing}
            isMutual={isMutual}
          />
        ) : (
          <p className="text-sm text-neutral-500">Sign in to follow this person.</p>
        )}
      </div>
    </main>
  );
}
