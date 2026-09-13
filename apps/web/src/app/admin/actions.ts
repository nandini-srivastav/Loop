"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Not authorized");
  }

  return supabase;
}

export async function approveEvent(eventId: string) {
  const supabase = await requireAdmin();
  await supabase.from("events").update({ status: "approved" }).eq("id", eventId);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function rejectEvent(eventId: string) {
  const supabase = await requireAdmin();
  await supabase.from("events").update({ status: "rejected" }).eq("id", eventId);
  revalidatePath("/admin");
}

export async function setVerifiedOrganiser(
  userId: string,
  societyName: string
) {
  const supabase = await requireAdmin();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("profiles")
      .update({ is_verified_organiser: true, verified_society_name: societyName })
      .eq("id", userId);
  } else {
    await supabase.from("profiles").insert({
      id: userId,
      is_verified_organiser: true,
      verified_society_name: societyName,
    });
  }

  revalidatePath("/admin");
}
