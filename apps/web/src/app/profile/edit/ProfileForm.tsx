"use client";

import { useActionState } from "react";
import { updateProfile } from "./actions";

type ExistingProfile = {
  username: string | null;
  bio: string | null;
  age: number | null;
  gender: string | null;
  pursuing: string | null;
  hobbies: string | null;
};

export default function ProfileForm({
  existing,
}: {
  existing: ExistingProfile | null;
}) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-neutral-500 mb-1">Username</label>
        <input
          name="username"
          type="text"
          required
          defaultValue={existing?.username ?? ""}
          placeholder="e.g. nandini_s"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
        <p className="text-xs text-neutral-500 mt-1">
          3-20 characters, letters/numbers/underscores only.
        </p>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Avatar (optional)</label>
        <input name="avatar" type="file" accept="image/*" className="w-full text-sm" />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Bio (optional)</label>
        <textarea
          name="bio"
          defaultValue={existing?.bio ?? ""}
          rows={3}
          placeholder="A short intro"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">Age (optional)</label>
          <input
            name="age"
            type="number"
            min="16"
            max="99"
            defaultValue={existing?.age ?? ""}
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-neutral-500 mb-1">Gender (optional)</label>
          <input
            name="gender"
            type="text"
            defaultValue={existing?.gender ?? ""}
            className="w-full border rounded-lg px-3 py-2 bg-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          What are you pursuing? (optional)
        </label>
        <input
          name="pursuing"
          type="text"
          defaultValue={existing?.pursuing ?? ""}
          placeholder="e.g. Bachelor of Engineering (Software)"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-500 mb-1">Hobbies (optional)</label>
        <input
          name="hobbies"
          type="text"
          defaultValue={existing?.hobbies ?? ""}
          placeholder="e.g. photography, chess, hiking"
          className="w-full border rounded-lg px-3 py-2 bg-transparent"
        />
      </div>

      {state?.error && <p className="text-red-600 text-sm">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 font-medium self-start"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
