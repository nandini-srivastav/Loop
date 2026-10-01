import { createClient } from "@/lib/supabase/server";
import EventFeed from "./EventFeed";
import RecommendedEvents from "./RecommendedEvents";
import FeaturedEvent from "./FeaturedEvent";
import WelcomeHero from "./WelcomeHero";
import Link from "next/link";
import { signOut } from "./actions/auth";
import UnreadBadge from "./UnreadBadge";

export default async function Home() {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let myUsername: string | null = null;
  if (user) {
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();
    myUsername = myProfile?.username ?? null;
  }

  return (
    <main className="min-h-screen p-6 max-w-5xl mx-auto relative">
      <div
        className="glow-decoration"
        style={{
          top: "-40px",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "linear-gradient(135deg, #FF5C7A, #B78CFF)",
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 relative" style={{ zIndex: 1 }}>
        <h1 className="text-2xl font-semibold">Loop</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/board" className="text-sm text-neutral-500">
            Board
          </Link>
          <Link href="/marketplace" className="text-sm text-neutral-500">
            Marketplace
          </Link>
          <Link href="/submit" className="text-sm text-neutral-500">
            Post event
          </Link>
          <Link href="/my-events" className="text-sm text-neutral-500">
            My events
          </Link>
          {user ? (
            <>
              <Link href="/messages" className="text-sm text-neutral-500">
                Messages
                <UnreadBadge userId={user.id} />
              </Link>
              <form action={signOut} className="flex items-center gap-2">
                <Link href="/profile/edit" className="text-sm text-neutral-500 underline">
                  {myUsername ?? "Set up profile"}
                </Link>
                <button type="submit" className="text-sm underline text-neutral-500">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm rounded-full px-4 py-1.5 btn-gradient btn-press font-medium"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {!user && <WelcomeHero />}

      {user && (
        <div className="mb-8 relative" style={{ zIndex: 1 }}>
          <h2 className="text-3xl md:text-4xl font-bold">
            Hi, {myUsername ?? "there"} 👋
          </h2>
          <p className="text-neutral-500 mt-1">Here&apos;s what&apos;s happening on campus.</p>
        </div>
      )}

      {!error && <FeaturedEvent />}

      {error && (
        <p className="text-red-600 text-sm mb-4">
          Couldn&apos;t load events: {error.message}
        </p>
      )}

      {!error && user && <RecommendedEvents userId={user.id} />}
      {!error && <EventFeed events={events ?? []} />}
    </main>
  );
}
