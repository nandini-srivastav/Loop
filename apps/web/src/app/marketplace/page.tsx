import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function formatPrice(listing: { price_type: string; price: number | null }) {
  if (listing.price_type === "free") return "Free";
  if (listing.price_type === "loan") return "For loan";
  return `$${listing.price}`;
}

export default async function Marketplace() {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <Link href="/" className="text-sm text-neutral-500">
          Back to feed
        </Link>
        <Link
          href="/marketplace/new"
          className="text-sm bg-black text-white dark:bg-white dark:text-black rounded-lg px-3 py-1.5 font-medium"
        >
          List an item
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>

      {error && (
        <p className="text-red-600 text-sm mb-4">
          Couldn&apos;t load listings: {error.message}
        </p>
      )}

      {!error && (!listings || listings.length === 0) && (
        <p className="text-neutral-500">
          Nothing listed yet — be the first to sell or loan something.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {listings?.map((listing) => (
          <Link
            key={listing.id}
            href={`/marketplace/${listing.id}`}
            className="block bg-neutral-100 dark:bg-neutral-900 rounded-xl overflow-hidden"
          >
            {listing.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800" />
            )}
            <div className="p-3">
              <p className="font-semibold">{listing.title}</p>
              <p className="text-sm text-emerald-500 mt-1">{formatPrice(listing)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
