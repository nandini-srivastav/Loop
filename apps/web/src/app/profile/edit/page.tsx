import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

export default async function EditProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, bio, age, gender, pursuing, hobbies")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen p-6">
      <Link href="/" className="text-sm text-neutral-500 mb-6 block">
        Back to feed
      </Link>
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-6">
          {profile?.username ? "Edit your profile" : "Set up your profile"}
        </h1>
        <ProfileForm existing={profile} />
      </div>
    </main>
  );
}
