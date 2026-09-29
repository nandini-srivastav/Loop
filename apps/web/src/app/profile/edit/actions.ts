"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You need to be signed in." };
  }

  const username = (formData.get("username") as string)?.trim();
  const bio = formData.get("bio") as string;
  const ageRaw = formData.get("age") as string;
  const gender = formData.get("gender") as string;
  const pursuing = formData.get("pursuing") as string;
  const hobbies = formData.get("hobbies") as string;

  if (!username) {
    return { error: "Username is required." };
  }

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return {
      error: "Username must be 3-20 characters: letters, numbers, underscores only.",
    };
  }

  let avatar_url: string | undefined;
  const avatarFile = formData.get("avatar") as File | null;

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop();
    const filePath = `${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile);

    if (uploadError) {
      return { error: `Avatar upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    avatar_url = publicUrl;
  }

  const updateData: Record<string, unknown> = {
    username,
    bio: bio || null,
    age: ageRaw ? parseInt(ageRaw, 10) : null,
    gender: gender || null,
    pursuing: pursuing || null,
    hobbies: hobbies || null,
  };
  if (avatar_url) updateData.avatar_url = avatar_url;

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("profiles").update(updateData).eq("id", user.id)
    : await supabase.from("profiles").insert({ id: user.id, ...updateData });

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken." };
    }
    return { error: error.message };
  }

  redirect(`/profile/${username}`);
}
