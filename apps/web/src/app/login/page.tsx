"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ALLOWED_DOMAIN_SUFFIXES = ["uq.edu.au", "uqconnect.edu.au"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    const domain = email.split("@")[1]?.toLowerCase();
    const isAllowed =
      !!domain &&
      ALLOWED_DOMAIN_SUFFIXES.some((suffix) => domain === suffix || domain.endsWith(`.${suffix}`));

    if (!isAllowed) {
      setStatus("error");
      setErrorMessage("Please use your UQ email (@uq.edu.au or @uqconnect.uq.edu.au).");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-semibold mb-6">Sign in to Loop</h1>

      {status === "sent" ? (
        <p className="text-neutral-500 max-w-sm text-center">
          Check your inbox — we sent a magic link to {email}.
        </p>
      ) : (
        <form onSubmit={handleSignIn} className="flex flex-col gap-3 w-full max-w-sm">
          <input
            type="email"
            required
            placeholder="you@uq.edu.au"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
          <button type="submit" className="bg-black text-white rounded-md px-3 py-2">
            Send magic link
          </button>
          {status === "error" && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
        </form>
      )}
    </main>
  );
}
