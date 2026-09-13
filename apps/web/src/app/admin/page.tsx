import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminPanel from "./AdminPanel";

export default async function Admin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Admin — pending events</h1>
      <AdminPanel events={events ?? []} />
    </main>
  );
}
