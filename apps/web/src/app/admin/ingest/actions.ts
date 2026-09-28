"use server";

import { createClient } from "@/lib/supabase/server";

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

export type ExtractedEvent = {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue_name: string;
  venue_address: string;
  organiser: string;
};

export async function extractEventFromText(
  rawText: string
): Promise<{ data: ExtractedEvent | null; error: string | null }> {
  await requireAdmin();

  if (!rawText.trim()) {
    return { data: null, error: "Paste some event text first." };
  }

  const prompt = `Extract structured event details from the following raw text (e.g. an Instagram caption or announcement). Return ONLY valid JSON, no other text, in this exact shape:
{"title": string, "description": string, "category": one of "society"|"careers"|"cultural"|"academic"|"sport", "date": "YYYY-MM-DD", "time": "HH:MM" (24hr), "venue_name": string, "venue_address": string, "organiser": string}

If a field genuinely can't be determined, use an empty string for it (except category, always pick the closest fit). Assume the current year (2026) if no year is stated.

Raw text:
"""
${rawText}
"""`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: `Claude API error: ${errText}` };
    }

    const result = await response.json();
    const text = result.content?.[0]?.text ?? "";
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    const parsed = JSON.parse(cleaned) as ExtractedEvent;

    return { data: parsed, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Extraction failed.",
    };
  }
}

export async function checkForDuplicates(title: string, date: string) {
  const supabase = await requireAdmin();

  const { data } = await supabase
    .from("events")
    .select("id, title, start_time")
    .ilike("title", `%${title.slice(0, 20)}%`)
    .gte("start_time", `${date}T00:00:00`)
    .lte("start_time", `${date}T23:59:59`);

  return data ?? [];
}

export async function ingestEvent(fields: ExtractedEvent) {
  const supabase = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const start_time = new Date(`${fields.date}T${fields.time || "00:00"}`).toISOString();

  const { error } = await supabase.from("events").insert({
    title: fields.title,
    description: fields.description || null,
    category: fields.category,
    categories: [fields.category],
    start_time,
    venue_name: fields.venue_name || "TBC",
    venue_address: fields.venue_address || fields.venue_name || "TBC",
    organiser: fields.organiser || null,
    status: "pending",
    source: "ingested",
    created_by: user!.id,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
