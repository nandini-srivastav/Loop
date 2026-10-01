# Loop

> Every UQ event, one place. Stop finding out about it after it happened.

**[Live demo](https://loop-plum-phi.vercel.app)**

Loop is a full-stack campus events platform built for University of Queensland students. It aggregates society, department, careers, and cultural events into a single feed, then layers on the things that actually get students to come back: a social discussion layer, a marketplace, user profiles with a follow/DM system, and AI-assisted features for both personalisation and content ingestion.

This started as a day-by-day build (see PLAN.md and REFERENCE.md for the original roadmap and architecture notes) and has since grown well beyond the original MVP scope.

## Why

UQ event info is scattered across dozens of society Instagram pages, department sites, and UQU channels. New students in particular miss events they'd have wanted to attend simply because they didn't follow the right account. Loop fixes the discovery problem first, then builds a lightweight social layer around it.

## Features

Events: multi-category feed with filters, event detail pages with Google Maps directions, .ics calendar export, an optional cover image, RSVP and save, event submission with an admin approval queue, and a verified-organiser badge granted manually by an admin.

Social: real-time per-event discussion threads, a campus-wide interest and partner-finding board with an anonymous-posting option, user profiles with a follow system, and direct messages unlocked once two users follow each other, with live delivery and read receipts.

Marketplace: listings for sale, free, or loan, with image uploads and buyer-seller messaging.

AI: rule-based event recommendations from a user's RSVP history, and an admin-only tool that extracts structured events from raw pasted text using the Claude API, with a duplicate check before anything enters the moderation queue.

## Tech stack

Frontend: Next.js (App Router), React, Tailwind CSS.
Backend, auth, database, realtime, and storage: Supabase (Postgres with Row-Level Security).
Maps: Google Maps deep links.
AI: Claude API.
Hosting: Vercel.

## Design decisions worth knowing about

Single-role model, not organiser vs attendee: every signed-in student can both attend and post events, there is no separate organiser account. Trust is signalled by an admin-granted verified-organiser badge instead, which keeps onboarding to one flow. Full reasoning is in REFERENCE.md.

Row-Level Security on every table: access control lives in Postgres policies, not just application code. For example, direct messages can only be inserted between two users who mutually follow each other, enforced at the database level.

Human-in-the-loop AI: the event-ingestion tool structures raw text with an LLM, but every ingested event still lands in the same moderation queue as a manually submitted one. Nothing publishes automatically.

## Project structure

apps/web is the Next.js frontend, the actual application. apps/scraper is a Python skeleton for a future automated scraping pipeline; it is not currently wired up, since ingestion today happens through the admin tool inside apps/web. supabase/migrations holds the full schema history, in order.

## Getting started

git clone https://github.com/nandini-srivastav/loop.git, then cd loop/apps/web, copy .env.example to .env.local and fill in your own Supabase project URL and key plus an Anthropic API key, then npm install and npm run dev.

You will need a Supabase project with the migrations in supabase/migrations applied in order, and a Claude API key from console.anthropic.com if you want to use the ingestion tool.

## Known limitations

Being upfront about what is not finished: mobile layout has some outstanding responsiveness issues on certain pages, some secondary pages such as profile, messages, and forms are narrower than ideal on very wide desktop screens, and the apps/scraper Python service is a placeholder, since real-world event scraping would need its own terms-of-service and legal review before being built out, as noted in REFERENCE.md.

## Contributing

Contributions welcome, see CONTRIBUTING.md. Look for issues labeled good first issue.

## License

MIT, see LICENSE.
