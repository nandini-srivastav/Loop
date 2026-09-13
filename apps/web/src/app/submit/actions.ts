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
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;
  const venue_name = formData.get("venue_name") as string;
  const venue_address = formData.get("venue_address") as string;
  const organiser = formData.get("organiser") as string;
  const description = formData.get("description") as string;

  if (!title || !category || !date || !time || !venue_name || !venue_address) {
    return { error: "Please fill in all required fields." };
  }

  const start_time = new Date(`${date}T${time}`).toISOString();

  const { error } = await supabase.from("events").insert({
    title,
    category,
    start_time,
    venue_name,
    venue_address,
    organiser: organiser || null,
    description: description || null,
    created_by: user.id,
    status: "pending",
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/submit/success");
}
