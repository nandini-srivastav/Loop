# Loop — background reference

> Check this when you're making an architecture or scope decision. For what to actually do today, see `PLAN.md`.

*A one-stop events, social, and marketplace platform for University of Queensland students.*

> Name: **Loop**. Worth a quick trademark/name-collision check before you launch publicly (there are other apps/products called "Loop" in unrelated spaces — check nothing conflicts closely enough to cause confusion or a takedown request), but the name itself is locked in.

---

## 1. Problem statement (for your README / pitch)

UQ event information is fragmented across society Instagram pages, department websites, UQU, myUQ, and word of mouth. Students — especially newcomers — routinely miss events they'd have wanted to attend simply because they didn't follow the right page. Loop aggregates every event in one place, adds light social and practical features around it, and layers in a marketplace and personalisation so the app has daily reasons to open, not just "event night" reasons.

## 2. Guiding principle for sequencing

Build in this order: **aggregation → utility → social → marketplace → AI**. Each phase should be usable and valuable on its own — don't let this become a big-bang launch. Get real UQ students using Phase 1 before you build Phase 4.

---

## 3. Phased roadmap

### Phase 0 — Foundation (1–2 weeks)
- Finalise name, scope, and MVP feature list (this doc)
- Wireframes / clickable prototype (see attached prototype)
- Set up GitHub repo, project board, CI (see Section 6)
- Recruit 3–5 "launch partner" societies/clubs willing to post real events during testing

### Phase 1 — MVP: the aggregator (6–8 weeks)
Goal: prove the core promise — "every event, one place" — even with manual curation.
- UQ-email-verified sign-up (magic link on `@uq.edu.au` / `@uqconnect.uq.edu.au`)
- Event feed: list + calendar view, filter by category (society / academic / careers / cultural / sport), date, and faculty
- Event detail page: date, time, venue, description, organiser, "tap venue → Google/Apple Maps directions from current location"
- Manual event submission form for club admins (self-serve — this is your first data pipeline, and it's the one that actually gets you live fastest)
- Basic admin/moderation panel to approve submitted events
- Save/RSVP to an event + calendar export (.ics)

**Ship this to real students before building anything below.** It's the smallest thing that tests your core hypothesis.

### Phase 2 — Utility & retention (4–6 weeks)
- Push/email notifications ("event you saved starts in 2 hours", "new event in a category you follow")
- Follow categories/faculties/societies instead of only browsing
- Search
- Light "who's going" social proof (opt-in visible RSVP count / avatars)

### Phase 3 — Social layer (4–6 weeks)
- Scope chat **per event or per interest**, not one giant firehose (a single 3,000-person group chat dies fast). Start with:
  - An auto-created chat thread per event ("anyone else going to X?")
  - Interest-tagged "looking for a partner / buddy" posts (your dance-partner example), searchable and filterable — this is closer to a lightweight bulletin board than a chat, which will scale much better than a single group chat
- Basic reporting/block/mute tools from day one — non-negotiable once you have open messaging between students

### Phase 4 — Marketplace (4–5 weeks)
- Listings: sell/loan textbooks, lab coats, stationery, notes; category + faculty tagging
- In-app contact (don't build payments yet — start with "message seller," let them arrange payment/handoff themselves, same as Facebook Marketplace/Marketplace-style campus apps)
- Basic listing moderation + report tool

### Phase 5 — Automated ingestion (ongoing, start research early)
This is the hardest and most valuable part — see Section 4. Start the legal/ToS research in Phase 1, don't leave it to Phase 5.

### Phase 6 — AI personalisation (after you have real usage data)
- "Recommended for you" based on RSVP/attendance history — start with simple content-based filtering (category, faculty, past RSVPs) before anything fancier; you won't have enough users for collaborative filtering early on
- Use an LLM (Claude API) server-side for two unglamorous but high-value jobs first: (a) structuring scraped/submitted text into clean event fields, (b) deduplicating the same event posted in two places

---

## 3.5. User model: single role, not organiser vs attendee

Every signed-in student can both attend and post — there is no separate "organiser account" or sign-up fork. This matches how the app is actually used: the same student RSVPs to events, posts a partner-finding message, and lists an old lab coat for sale. Splitting that into two segments would add onboarding friction and undersell the peer-to-peer, grassroots growth model without adding real safety or clarity.

What replaces a role split:
- **Submission + moderation queue** (everyone submits into the same queue; you approve) does the actual gatekeeping on event quality
- **A verified-organiser badge** — a boolean flag on a profile (`is_verified_organiser`), set manually by an admin once a real society/department confirms who they are — shown on event cards as a trust signal, not an access control. This can later grow into a self-serve claim flow for society accounts, but starts as a manual admin toggle

## 4. Data sourcing strategy (the actual hard problem)

Aggregation is the whole product, so this deserves its own plan, not an afterthought.

1. **Manual submission + partnerships (Phase 1, do this first).** Directly approach UQU-affiliated clubs and societies and pitch the app as free promotion. A form that takes 60 seconds to fill in beats any scraper for launch data quality.
2. **Official UQ sources.** Check for an events RSS/calendar feed from UQ's official events page and UQU — these are the lowest-risk, highest-trust source and usually fine to ingest.
3. **Instagram/social ingestion — proceed carefully.** Automated scraping of Instagram content can violate Meta's Terms of Service regardless of technical feasibility. Before building this:
   - Check the Instagram Graph API's official terms for what's actually permitted (e.g. content published by accounts that explicitly connect/authorise your app)
   - Consider asking club admins to opt in and cross-post via a simple webhook/share action instead of scraping them without consent
   - If you do explore third-party scraping tools, treat it as a legal-risk decision, not just a technical one — get real advice before shipping it, not after
4. **LLM extraction pipeline.** Whatever the source, funnel raw text into a small pipeline: raw text → LLM structures it into `{title, date, time, venue, category, organiser}` → dedup check against existing events → moderation queue → published. This is the same pipeline regardless of whether the source is a submission form or a partner feed, so build it generically from Phase 1.

---

## 5. Suggested tech stack

Optimised for: one person or a small student team, wanting to move fast, keep costs near-zero pre-launch, and have an easy on-ramp for open-source contributors.

| Layer | Choice | Why |
|---|---|---|
| Frontend (web + mobile) | **Next.js (React) + Tailwind CSS**, deployed as a installable PWA first | One codebase, works on any student's phone immediately with no app store friction; wrap in **Expo/React Native** later if you want native app-store presence, reusing most component logic |
| Backend / DB / Auth / Realtime | **Supabase** (Postgres + Auth + Row-Level Security + Realtime + Storage) | Massively cuts backend work for a small team; built-in magic-link auth is a good fit for UQ-email verification; Realtime channels cover event-chat/notifications without standing up your own WebSocket server |
| Maps | Google Maps Platform (Directions/Places) or Mapbox | "Tap venue → directions from here" is a single deep link (`https://www.google.com/maps/dir/?api=1&destination=...`), no SDK needed for MVP |
| Scraper / ingestion service | Separate small **Python** service (Playwright/Requests + a scheduler) | Python has the best scraping/parsing ecosystem; keep it decoupled from the main app so it can be paused, rate-limited, or replaced without touching the product |
| AI extraction & recommendations | **Claude API** (structured JSON output) called from the ingestion service and a lightweight recommendations endpoint | Use for text→structured-event extraction and dedup first; keep recommendation logic simple (rule/content-based) before anything model-heavy |
| Hosting | Vercel (frontend) + Supabase (backend) + a small always-on host (Fly.io/Railway) for the Python scraper's cron jobs | Free/cheap tiers cover an MVP comfortably |
| Notifications | Web Push (via a service worker) for MVP; expand to native push once you have a wrapped mobile app | Avoids needing app-store approval before you can notify users |

This stack is a strong default, not a mandate — if you or teammates already know a different stack well, "boring and known" beats "optimal and unfamiliar" for a project you need to actually ship.

---

## 6. Running it like a real open-source project

This is the part that also builds your GitHub/open-source presence — treat it as seriously as the product.

**Repo structure** — see the scaffold in this delivery (`uq-pulse-repo-scaffold.zip`): `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE` (MIT is the friendliest default for attracting contributors), `.github/` with issue templates, a PR template, and a CI workflow.

**Workflow that looks good on a GitHub profile and actually works:**
- `main` branch is protected — no direct pushes, PRs only, at least one review required (self-review is fine solo, but leave the setting on so it's visible)
- One feature/fix per branch, named `feat/event-feed`, `fix/map-deeplink`, etc.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`) — makes changelogs and semantic versioning automatable later, and reviewers (including future-you) instantly understand a commit log
- Every PR: links an issue, has a short description of *what* and *why*, passes CI before merge
- Use **GitHub Projects** (kanban board) linked to issues for Phase tracking — recruiters and collaborators skim this
- Label a handful of small, well-scoped issues `good first issue` once the repo is public — this is what actually attracts outside contributors, not the README alone
- Squash-merge PRs so `main` history stays readable

**CI (GitHub Actions), minimum viable:** on every PR — install deps, lint, type-check, run tests, build. Fail the PR if any step fails. Add this from the very first PR, not after the codebase is big.

**README checklist:** problem statement, screenshot/GIF of the prototype, tech stack table, local setup instructions (`git clone` → running in under 5 commands), architecture diagram, roadmap link, contribution link, license.

---

## 7. Immediate next steps

1. Review the clickable prototype and roadmap, adjust scope/priorities
2. Set up the GitHub repo from the provided scaffold, make repo public
3. Pick 3–5 launch-partner societies to commit event content for testing
4. Start Phase 1 build: auth + event feed + submission form + map deep link
5. Start the Instagram/API ToS research in parallel — don't let it block Phase 1, but don't leave it until Phase 5 either
