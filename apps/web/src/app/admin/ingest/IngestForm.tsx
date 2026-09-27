"use client";

import { useState } from "react";
import {
  extractEventFromText,
  checkForDuplicates,
  ingestEvent,
  type ExtractedEvent,
} from "./actions";

export default function IngestForm() {
  const [rawText, setRawText] = useState("");
  const [extracted, setExtracted] = useState<ExtractedEvent | null>(null);
  const [duplicates, setDuplicates] = useState<{ id: string; title: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "extracting" | "ready" | "submitted" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleExtract() {
    setStatus("extracting");
    setErrorMsg("");
    const { data, error } = await extractEventFromText(rawText);

    if (error || !data) {
      setStatus("error");
      setErrorMsg(error ?? "Extraction failed.");
      return;
    }

    setExtracted(data);
    const dupes = await checkForDuplicates(data.title, data.date);
    setDuplicates(dupes);
    setStatus("ready");
  }

  async function handleSubmit() {
    if (!extracted) return;
    const { error } = await ingestEvent(extracted);
    if (error) {
      setStatus("error");
      setErrorMsg(error);
      return;
    }
    setStatus("submitted");
  }

  function updateField(field: keyof ExtractedEvent, value: string) {
    if (!extracted) return;
    setExtracted({ ...extracted, [field]: value });
  }

  if (status === "submitted") {
    return (
      <p className="text-emerald-500">
        Added to the moderation queue as a pending event — approve it in the admin panel like any other submission.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-neutral-500 mb-1">
          Raw event text (e.g. copied from an Instagram caption)
        </label>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={6}
          placeholder="🎉 UQ Coding Club presents: Hackathon Night! Join us Friday 10 Oct at 6pm in the Innovation Hub for a night of building..."
          className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent"
        />
      </div>

      <button
        onClick={handleExtract}
        disabled={status === "extracting" || !rawText.trim()}
        className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium self-start"
      >
        {status === "extracting" ? "Extracting..." : "Extract event details"}
      </button>

      {status === "error" && <p className="text-red-600 text-sm">{errorMsg}</p>}

      {extracted && status === "ready" && (
        <div className="border rounded-lg p-4 flex flex-col gap-3 mt-2">
          <p className="text-sm font-medium text-neutral-500">
            Review before adding to the moderation queue
          </p>

          {duplicates.length > 0 && (
            <p className="text-sm text-amber-500">
              Possible duplicate: &quot;{duplicates[0].title}&quot; already exists on this date.
            </p>
          )}

          {(Object.keys(extracted) as (keyof ExtractedEvent)[]).map((field) => (
            <div key={field}>
              <label className="block text-xs text-neutral-500 mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                value={extracted[field]}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full border rounded-lg px-2 py-1.5 text-sm bg-transparent"
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="bg-black text-white dark:bg-white dark:text-black rounded-lg px-4 py-2 text-sm font-medium self-start mt-2"
          >
            Add to moderation queue
          </button>
        </div>
      )}
    </div>
  );
}
