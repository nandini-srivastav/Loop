"use client";

import { useTransition } from "react";
import Link from "next/link";
import { followUser, unfollowUser } from "./actions";

export default function FollowButton({
  profileUserId,
  username,
  isFollowing,
  isMutual,
}: {
  profileUserId: string;
  username: string;
  isFollowing: boolean;
  isMutual: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(() => {
            if (isFollowing) {
              unfollowUser(profileUserId, username);
            } else {
              followUser(profileUserId, username);
            }
          })
        }
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          isFollowing
            ? "bg-neutral-200"
            : "bg-black text-white"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>

      {isMutual && (
        <Link
          href={`/messages/${username}`}
          className="text-sm underline text-neutral-500"
        >
          Message
        </Link>
      )}
    </div>
  );
}
