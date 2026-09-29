"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Post = {
  id: string;
  content: string;
  category: string | null;
  created_at: string;
  is_anonymous: boolean;
  user_id: string;
  likeCount: number;
  likedByMe: boolean;
  username: string | null;
};

const CATEGORIES = ["all", "society", "careers", "cultural", "academic", "sport"];

export default function InterestBoard({ isSignedIn }: { isSignedIn: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("society");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  async function loadPosts() {
    const { data: rawPosts } = await supabase
      .from("interest_posts")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: likes } = await supabase.from("interest_post_likes").select("post_id, user_id");
    const { data: profiles } = await supabase.from("profiles").select("id, username");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const enriched = (rawPosts ?? []).map((p) => ({
      ...p,
      likeCount: likes?.filter((l) => l.post_id === p.id).length ?? 0,
      likedByMe: !!likes?.some((l) => l.post_id === p.id && l.user_id === user?.id),
      username: profiles?.find((pr) => pr.id === p.user_id)?.username ?? null,
    }));

    setPosts(enriched);
    setUserId(user?.id ?? null);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !userId) return;

    await supabase.from("interest_posts").insert({
      user_id: userId,
      content: content.trim(),
      category,
      is_anonymous: isAnonymous,
    });
    setContent("");
    setIsAnonymous(false);
    loadPosts();
  }

  async function toggleLike(postId: string, likedByMe: boolean) {
    if (!userId) return;

    if (likedByMe) {
      await supabase
        .from("interest_post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);
    } else {
      await supabase.from("interest_post_likes").insert({ post_id: postId, user_id: userId });
    }
    loadPosts();
  }

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div>
      {isSignedIn ? (
        <form onSubmit={submitPost} className="flex flex-col gap-2 mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Looking for a partner to learn salsa for the dance night, or anyone else heading to the careers fair?"
            rows={2}
            className="border rounded-lg px-3 py-2 text-sm bg-transparent"
          />
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-2 py-1.5 text-sm bg-transparent"
            >
              {CATEGORIES.filter((c) => c !== "all").map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-black">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1.5 text-sm text-neutral-500">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              Post anonymously
            </label>
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-1.5 text-sm font-medium"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-neutral-500 mb-6">Sign in to post to the board.</p>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap capitalize ${
              filter === c
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-neutral-500 text-sm">Nothing posted yet in this category.</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((post) => (
          <div key={post.id} className="bg-neutral-100 dark:bg-neutral-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              {post.is_anonymous || !post.username ? (
                <span className="font-semibold text-sm" style={{ color: "#B78CFF" }}>
                  Anonymous
                </span>
              ) : (
                <Link
                  href={`/profile/${post.username}`}
                  className="font-semibold text-sm underline"
                  style={{ color: "#FF5C7A" }}
                >
                  @{post.username}
                </Link>
              )}
              {post.category && (
                <span className="text-xs uppercase tracking-wide text-neutral-500 bg-neutral-200 dark:bg-neutral-800 rounded-full px-2 py-0.5">
                  {post.category}
                </span>
              )}
            </div>
            <p className="mb-3">{post.content}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLike(post.id, post.likedByMe)}
                disabled={!isSignedIn}
                className={`text-xs px-2.5 py-1 rounded-full ${
                  post.likedByMe
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-neutral-200 dark:bg-neutral-800"
                }`}
              >
                👍 {post.likeCount}
              </button>
              <span className="text-xs text-neutral-500">
                {new Date(post.created_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
