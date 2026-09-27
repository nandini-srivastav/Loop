import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ListingMessages from "./ListingMessages";
import MarkSoldButton from "./MarkSoldButton";

function formatPrice(listing: { price_type: string; price: number | null }) {
  if (listing.price_type === "free") return "Free";
  if (listing.price_type === "loan") return "For loan";
  return `$${listing.price}`;
}

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: listing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .neq("status", "removed")
    .single();

  if (!listing) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === listing.seller_id;

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <Link href="/marketplace" className="text-sm text-neutral-500 mb-6 block">
        Back to marketplace
      </Link>

      {listing.category && (
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          {listing.category}
        </span>
      )}
      <h1 className="text-2xl font-semibold mt-1 mb-2">{listing.title}</h1>

      {listing.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-full rounded-xl mb-4 max-h-80 object-cover"
        />
      )}

      <p className="text-emerald-500 font-medium mb-4">{formatPrice(listing)}</p>

      {listing.status !== "available" && (
        <p className="text-sm text-neutral-500 mb-4">
          This item is marked as {listing.status}.
        </p>
      )}

      {listing.description && (
        <p className="mb-6 whitespace-pre-wrap">{listing.description}</p>
      )}

      {isOwner ? (
        <MarkSoldButton listingId={listing.id} priceType={listing.price_type} />
      ) : (
        user && listing.status === "available" && (
          <ListingMessages listingId={listing.id} />
        )
      )}

      {!user && listing.status === "available" && (
        <p className="text-sm text-neutral-500">
          Sign in to message the seller.
        </p>
      )}
    </main>
  );
}
