"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createListing(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to list an item." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price_type = formData.get("price_type") as string;
  const priceRaw = formData.get("price") as string;
  const category = formData.get("category") as string;

  if (!title || !price_type) {
    return { error: "Please fill in the required fields." };
  }

  const price = price_type === "fixed" ? parseFloat(priceRaw) || 0 : null;

  let image_url: string | null = null;
  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(filePath);

    image_url = publicUrl;
  }

  const { error } = await supabase.from("listings").insert({
    seller_id: user.id,
    title,
    description: description || null,
    price_type,
    price,
    category: category || null,
    image_url,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/marketplace");
}

export async function markListingStatus(listingId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId)
    .eq("seller_id", user.id);

  revalidatePath(`/marketplace/${listingId}`);
  revalidatePath("/marketplace");
}

export async function sendListingMessage(listingId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !content.trim()) return;

  await supabase.from("listing_messages").insert({
    listing_id: listingId,
    sender_id: user.id,
    content: content.trim(),
  });
}
