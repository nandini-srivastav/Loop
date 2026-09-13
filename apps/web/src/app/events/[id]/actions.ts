"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_signed_in" };
  }

  const { data: existing } = await supabase
    .from("rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("rsvps").delete().eq("id", existing.id);
  } else {
    await supabase.from("rsvps").insert({ event_id: eventId, user_id: user.id });
  }

  revalidatePath(`/events/${eventId}`);
  return { error: null };
}

export async function toggleSave(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not_signed_in" };
  }

  const { data: existing } = await supabase
    .from("saved_events")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_events").delete().eq("id", existing.id);
  } else {
    await supabase.from("saved_events").insert({ event_id: eventId, user_id: user.id });
  }

  revalidatePath(`/events/${eventId}`);
  return { error: null };
}
