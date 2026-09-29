"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitEvent(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in to submit an event." };
  }

  const title = formData.get("title") as string;
  const categories = formData.getAll("categories") as string[];
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const venue_name = formData.get("venue_name") as string;
  const venue_address = formData.get("venue_address") as string;
  const organiser = formData.get("organiser") as string;
  const description = formData.get("description") as string;

  if (!title || categories.length === 0 || !date || !time || !venue_name || !venue_address) {
    return { error: "Please fill in all required fields, including at least one category." };
  }

  const start_time = new Date(`${date}T${time}`).toISOString();

  let image_url: string | null = null;
  const imageFile = formData.get("image") as File | null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      return { error: `Image upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("event-images").getPublicUrl(filePath);

    image_url = publicUrl;
  }

  const { error } = await supabase.from("events").insert({
    title,
    category: categories[0],
    categories,
    start_time,
    venue_name,
    venue_address,
    organiser: organiser || null,
    description: description || null,
    created_by: user.id,
    status: "pending",
    image_url,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/submit/success");
}
