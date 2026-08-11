# Loop — day-by-day build plan (solo, React/JS-comfortable)

Assumes ~2–3 focused hours/day, 5 days/week (adjust pace to your actual availability — the point is the order and the definition of "done" for each day, not the calendar). Each week states its goal first. Growth/adoption tasks are woven in throughout, not left to the end — a perfectly built app nobody knows about fails the same way a broken one does.

## Product decisions log

- **User model: single role, not a two-segment organiser/attendee split.** Every signed-in student can both attend and post — there's no separate "organiser account." What used to be "who can create an event" is handled by two lighter mechanisms instead: (1) the submission → admin-approval queue everyone already goes through, and (2) an optional **verified-organiser badge** shown on event cards when the poster is a recognised society/department, which is a trust signal, not an access gate. This keeps sign-up to one flow and matches how students actually use the app (the same person RSVPs, posts a partner-finding message, and sells their old lab coat).

---

## Phase 0 — Validate before you build (Week 1)

**Goal: confirm real demand and lock scope before writing product code.**

- **Day 1** — Write the one-paragraph pitch + list your top 5 target "launch partner" societies/clubs (mix of a large one, a cultural one, a sports one — diverse enough to stress-test the category system later)
- **Day 2** — DM/email those 5 clubs. Ask one question: "would you post your events here if it took under a minute?" You need at least 3 yesses before Day 6 — if you don't get them, spend extra days on outreach, don't skip to building
- **Day 3** — Interview or message 8–10 UQ students (mix of first-years and later-years) about how they currently find events and what's most annoying. Write down exact quotes — you'll use this language in your UI copy later
- **Day 4** — Finalise the MVP feature list based on what you heard (compare against the roadmap's Phase 1 list — cut anything nobody mentioned)
- **Day 5** — Register a domain name, create the GitHub repo from the scaffold provided, set repo to public, add the first 6 issues (see previous message), set up a GitHub Project board with columns: Backlog / This week / In review / Done
- **Ongoing from Day 5 onward** — enable Supabase automatic backups as soon as any real data exists; wire up basic error monitoring (Sentry or similar) and analytics (Plausible/Vercel Analytics) alongside the Phase 1 deploy (Day 10), not after

---

## Phase 1 — Foundation (Weeks 2–3)

**Goal: an empty but real, deployed, authenticated app.**

- **Day 6** — `create-next-app` with TypeScript + Tailwind, push first commit, confirm CI workflow runs and passes
- **Day 7** — Create Supabase project. Design the `events` table schema (title, description, category, start_time, end_time, venue_name, venue_address, organiser, source, status, created_by, created_at). Write the SQL migration, commit it under `supabase/migrations`
- **Day 8** — Add `profiles`, `rsvps`, and `saved_events` tables with foreign keys to `events` and `auth.users`. No separate role/account-type field — every profile can attend and submit by default. Add a single `is_verified_organiser boolean default false` (plus `verified_society_name`) on `profiles` for the badge in Day 17/Day 20, not a role split. Turn on Row-Level Security; write policies (read: anyone; write: authenticated + owns row)
- **Day 9** — Wire up Supabase Auth magic-link sign-in restricted to `@uq.edu.au` / `@uqconnect.uq.edu.au` domains (reject others with a clear error message). Build the sign-in screen
- **Day 10** — Deploy to Vercel, connect the domain, confirm auth works end-to-end in production, not just localhost. Merge PR #1, close first issues

---

## Phase 2 — Core aggregator MVP (Weeks 4–7)

**Goal: the actual "one stop" promise — a working, submittable, browsable event feed.**

- **Day 11** — Build the event feed page: card list, pulling from Supabase, sorted by `start_time` ascending, hiding past events
- **Day 12** — Add category filter chips and date filter (Today / This week / All) — client-side filtering is fine at this scale
- **Day 13** — Build the event detail page: full description, organiser, formatted date/time
- **Day 14** — Add the "get directions" deep link (`https://www.google.com/maps/dir/?api=1&destination=...`) using `venue_address`. Test it actually opens Maps from a phone, not just desktop
- **Day 15** — Add save/RSVP button + a "my events" view filtered to the signed-in user's saves
- **Day 16** — Build the event submission form (title, description, category select, date/time pickers, venue text/address, organiser name) — write straight to `events` with `status = 'pending'` for now
- **Day 17** — Build a minimal `/admin` route (protect it by checking your own user ID server-side) listing pending events with approve/reject buttons, plus a toggle to grant/revoke `is_verified_organiser` on a profile when a real society confirms who they are (manual for now — no self-serve verification flow yet)
- **Day 18** — Add `.ics` calendar export on the event detail page (a saved event should be addable to the student's own calendar app in one tap)
- **Day 18b** — Show the verified-organiser badge (small checkmark + society name) on event cards and the detail page when `is_verified_organiser` is true on the poster's profile — this is the only visible trace of the "who can post" decision anywhere in the UI
- **Day 19** — Empty states, loading states, error states for every screen built so far — this is where "prototype" starts turning into "product"
- **Day 20** — Mobile responsiveness pass on every screen built so far (test on an actual phone, not just devtools resize)
- **Day 21** — Accessibility pass: keyboard navigation, focus states, alt text, color contrast check
- **Day 22–23** — Write real copy throughout (empty states, button labels, error messages) using the exact language you heard in Day 3 interviews
- **Day 24** — Basic analytics (Plausible or Vercel Analytics — nothing invasive) so you can see what's actually being used after launch
- **Day 25** — Send the app to your 3+ committed launch partners, get them submitting real events through the form. Fix whatever breaks
- **Day 26** — Send the app to your Day 3 interviewees for a first real-user test. Watch them use it if you can (in person beats remote for this)
- **Day 27–28** — Fix the top issues from that test. Don't add new features yet — fix friction in what exists
- **Day 29** — Soft-launch post in 1–2 relevant UQ Facebook groups / course Discords, framed around the exact problem (missed events), not the feature list
- **Day 30** — Retrospective: what got used, what didn't, what students asked for unprompted. This determines whether Phase 3 proceeds as planned or gets reordered
- **Around this point, ongoing** — start a weekly 15-minute habit: check in with any launch-partner society that's gone quiet, and log unprompted feedback in one running doc. This keeps Track D (partnerships) and Track A (validation) alive without needing a separate plan to consult

**Ship gate: don't move to Phase 3 until real students are submitting and browsing real events without your prompting.**

---

## Phase 3 — Utility & retention (Weeks 8–9)

**Goal: give people a reason to come back before the next big event, not just check once.**

- **Day 31** — Add "follow" for categories and individual societies (a join table, `follows`)
- **Day 32** — Build the notification data model — what triggers a notification, and to whom
- **Day 33** — Implement web push (service worker + Supabase Edge Function or a cron job checking upcoming saved/followed events)
- **Day 34** — Notification preferences screen (let people turn categories on/off — respect their attention, this is what keeps them from muting you entirely)
- **Day 35** — Search (start simple: Postgres `ilike` on title/description is enough at this scale — don't reach for a search service yet)

---

## Phase 4 — Social layer (Weeks 10–13)

**Goal: light, safe socialising — scoped, not a single giant chatroom.**

- **Day 36** — Design the schema: `event_threads` (one per event, auto-created) and `posts` (interest/partner-finding board, tagged by category, not tied to one event)
- **Day 37** — Build the event-scoped thread UI on the event detail page (simple flat message list first, no nesting)
- **Day 38** — Add Supabase Realtime subscription so messages appear live without refresh
- **Day 39** — Build the interest/partner-finding board (your dance-partner example) as its own tab — list + "post" composer + thumbs-up reaction
- **Day 35b** — Before the social layer goes live: draft a privacy policy and terms page (you're now handling messaging between students) and a short, plain-language moderation policy (what gets a warning vs an immediate block). Both need to exist before Day 36, not be retrofitted after
- **Day 40** — **Report and block, before anything else ships in this phase.** A report button on every message/post that flags to your admin view, and a per-user block that hides their content from you
- **Day 41** — Basic profanity/spam filter on submission (client + server-side check) as a first line of defence, not a replacement for reporting
- **Day 42** — Rate-limit posting (e.g. max N posts per user per hour) to blunt spam before it starts
- **Day 43** — Test the social features with your launch-partner societies specifically — this is the feature most likely to go quiet or go wrong without real users
- **Day 44–45** — Fix issues found in Day 43 testing; write a short, plain-language community guidelines page linked from the posting composer

---

## Phase 5 — Marketplace (Weeks 14–16)

**Goal: a reason to open the app even in weeks with nothing you'd RSVP to.**

- **Day 46** — Schema: `listings` (title, description, price or "free"/"loan", category, faculty tag, images, seller_id, status)
- **Day 47** — Listing creation form with image upload to Supabase Storage
- **Day 48** — Marketplace browse/grid page with category and faculty filters
- **Day 49** — Listing detail page with "message seller" (opens a simple direct-message thread — reuse the realtime pattern from Phase 4)
- **Day 50** — Mark-as-sold/loaned-out flow so stale listings don't clutter the feed
- **Day 51** — Report/block reuse from Phase 4 extended to listings and sellers
- **Day 52** — Seed the marketplace yourself with 10–15 real listings (old lab coats, notes, textbooks from people you know) so it isn't an empty room on day one
- **Day 53–55** — Test, fix, and specifically ask a few students to try selling something real through it before wider launch

---

## Phase 6 — Automated ingestion (Weeks 17–21)

**Goal: reduce reliance on manual submission — this is what actually delivers "every event, one place" at scale.**

- **Day 56** — Legal/ToS research day: read Instagram/Meta Graph API terms and any official UQ events feed terms properly before writing a line of scraper code. Write up what's actually permitted (this can be read earlier than Day 56 if you have spare time in an earlier week — it just needs to be done before any ingestion code, wherever it falls)
- **Day 57** — If an official UQ/UQU events RSS or calendar feed exists, build the ingestion job for that first — lowest risk, do it regardless of the Instagram outcome
- **Day 58** — Design the generic ingestion pipeline: raw source → LLM structuring → dedup check → moderation queue → publish (same shape regardless of source)
- **Day 59** — Build the LLM extraction step: send raw text to the Claude API with a structured-output prompt, get back `{title, date, time, venue, category, organiser}`
- **Day 60** — Build the dedup check (compare new candidate events against existing ones by title similarity + date + venue) so the same event posted twice doesn't show twice
- **Day 61** — Wire ingested candidates into the same `/admin` moderation queue built in Phase 2, don't auto-publish unreviewed content yet
- **Day 62** — Based on Day 56's findings: either build an opt-in cross-posting flow for club admins (safer) or a compliant API-based ingestion path — do not build unauthorised scraping regardless of time pressure
- **Day 63–64** — Onboard a second wave of societies onto whichever ingestion path you built, beyond your original 3–5 launch partners
- **Day 65** — Retro on data coverage: what fraction of real UQ events (that you can independently verify) are now actually showing up in the app

---

## Phase 7 — AI personalisation (Weeks 22–24)

**Goal: only build this once there's real usage data to personalise on.**

- **Day 66** — Instrument what you need: RSVP history, category follows, past attendance if trackable
- **Day 67** — Start with rule-based recommendations (same category/faculty as past RSVPs, ranked by recency) — resist the pull to reach for a fancier model before this baseline is live
- **Day 68** — Build the "recommended for you" section on the home/profile screen
- **Day 69** — Add a lightweight feedback signal (thumbs up/down or "not interested") on recommendations so you can improve ranking later
- **Day 70** — Measure: are recommended events actually getting more RSVPs than average? If not, don't add complexity — go find out why with real users before iterating on the algorithm

---

## Weekly rhythm — running the non-coding tracks alongside this plan

These aren't separate days, they're a standing weekly habit that runs underneath the whole plan above, from Day 1:

- **Start of each week**: 15–20 min checking for any outreach/partnership follow-ups due
- **As each screen ships**: a copy pass with real language (from your Day 3 interviews), not placeholder text
- **End of each week**: log any unprompted student feedback

## Ongoing — growth, scale, and native app (Week 25 onward, continuous)

These don't have single "days" — they're recurring operating rhythm once the core product is live:

- **Weekly**: check analytics for drop-off points; personally message 2–3 societies who haven't posted recently
- **Every 2 weeks**: campus visibility push — flyers/QR codes at high-traffic spots (library, Union), a stall at a market day if UQU allows it, a short demo video for society Facebook groups
- **Monthly**: recruit 1–2 "campus ambassadors" (active society members) to own outreach in their own club networks — this scales adoption far better than you doing it alone
- **Ongoing**: keep `good first issue`-labeled tickets available if you want outside open-source contributors; review and merge PRs promptly to keep the repo feeling alive
- **When usage justifies it**: wrap the PWA in Expo/React Native for app-store presence — do this after organic web/PWA usage proves the product, not before, since app-store friction (download + account creation) will otherwise suppress your early adoption numbers
- **Revisit ROADMAP.md's data-sourcing section every semester** — society leadership turns over every year at university, so your partner relationships need re-establishing annually

---

## What "real-life production" actually requires that's easy to forget

- **Backups**: enable Supabase's automatic backups before you have real user data you can't afford to lose
- **Uptime/error monitoring**: Sentry (or similar) wired in from Phase 2 onward — you want to know about a broken submission form before students tell you
- **A privacy policy and terms page**: required once you're collecting UQ student emails and running any social/messaging feature — do this before the social layer ships, not after
- **A way for users to delete their account and data**: build this alongside auth, not as an afterthought
- **Semester-aware freshness**: events go stale fast in a university calendar — make sure your feed logic (and your outreach to societies) accounts for O-week, exam periods, and semester breaks, when usage patterns swing hardest
