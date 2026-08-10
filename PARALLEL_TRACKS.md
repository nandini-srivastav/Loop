# UQ Pulse — parallel workstreams

The day-by-day plan is written as one sequence because you're solo, but a lot of what makes this succeed isn't code — it's validation, partnerships, legal groundwork, and growth, and those don't wait for engineering to "get to them." This doc lays out everything as **7 concurrent tracks** so you can see what should be running in the background from week one, even while your hands-on-keyboard time is mostly on Track B.

**How to actually run 7 tracks solo:** you're not doing all of them full-time — most weeks look like ~80% engineering time and short, scheduled bursts on the others (a 15-minute outreach message, a 20-minute legal-research read, one growth post). The point of this doc is that those bursts happen *every week from day one*, not "later once the app is built."

---

## Track A — Product & validation (never really stops)

Runs heaviest in week 1, then continues as a lightweight habit throughout.

- [ ] Write the one-paragraph pitch + target launch-partner list (5 clubs)
- [ ] Talk to 8–10 students about how they currently find events; capture exact quotes for later UI copy
- [ ] Lock MVP scope against what you actually heard, not the full feature wishlist
- [ ] **Ongoing**: after every feature ships, get it in front of 2–3 real students before building the next thing
- [ ] **Ongoing**: keep a running doc of unprompted feature requests — this is your Phase 2+ prioritisation input, not your own guesses

**Blocks**: Track D (partnerships) needs the pitch from this track before outreach starts. Track B's "ship gate" (Phase 2, end of MVP) depends on this track's ongoing user testing.

---

## Track B — Engineering

This is the sequence from `DAY_BY_DAY_PLAN.md` — foundation → aggregator MVP → utility → social → marketplace → ingestion → AI. Runs continuously; it's the track that consumes most of your hours. Not repeated in full here — see that file for the day-level breakdown.

**Depends on**: Track C for copy/visual assets before each screen ships polished, not after. Track E for the privacy policy before the social layer (Phase 4) goes live, and for the ToS research before any automated ingestion (Phase 6) code gets written.

---

## Track C — Design, content & copy

Needs to run just ahead of engineering, not after — screens should launch with real copy and the theme locked, not placeholder text swapped in later.

- [ ] Lock the visual theme (done — dark vibrant palette, coral/mint/amber/purple accents)
- [ ] Finalise the app name and wordmark
- [ ] Write real microcopy for every screen as it's built: empty states, error states, button labels — pull language from Track A's student interviews
- [ ] Design the verified-organiser badge treatment (small checkmark + society name, shown on cards)
- [ ] Write the community guidelines page (needed before Track B's Phase 4 social layer ships)
- [ ] Design a simple launch one-pager / demo screenshots for Track F to use in outreach posts
- [ ] Keep a lightweight design-notes file (what you tried, what you rejected, why) so the theme stays consistent as new screens get added

---

## Track D — Partnerships & data sourcing

This is the track that actually determines whether the feed has real content on day one. Start it in week 1, not once the app is ready.

- [ ] Contact the 5 target clubs from Track A; get 3+ firm commitments to post real events
- [ ] Once the submission form (Engineering Phase 2) exists, personally onboard each committed club — walk them through it once so it's not a barrier
- [ ] Identify and check for an official UQ/UQU events RSS or calendar feed (start this early — it feeds Engineering Phase 6, but the *research* can happen anytime)
- [ ] Recruit a second wave of societies once the app is live and demo-able (Weeks 6+)
- [ ] Each semester: re-confirm partner contacts, since club committees turn over annually

**Depends on**: Track A's pitch and interview findings. **Blocks**: Engineering Phase 2's real-content soft launch, and Engineering Phase 6's ingestion coverage.

---

## Track E — Legal, privacy & trust

Easy to defer, expensive to defer — start the reading early even though the building comes later.

- [ ] Read Instagram/Meta Graph API terms and any official UQ data-feed terms (do this in week 1–2, well before Engineering Phase 6 needs the answer)
- [ ] Draft a privacy policy and terms page — needed before Phase 4 (social/chat) ships, since you're handling messaging between students
- [ ] Design the account-deletion flow requirement (build alongside auth in Engineering Phase 1, not bolted on later)
- [ ] Set a moderation policy for reports (what gets a warning vs an immediate block) before the report button (Phase 4) goes live
- [ ] Decide your data-retention approach for chat/marketplace messages

**Blocks**: Engineering Phase 4 (social layer) and Phase 6 (automated ingestion) shouldn't ship without this track's outputs.

---

## Track F — Growth & marketing

Starts the moment there's anything demoable — don't wait for "feature complete."

- [ ] Soft-launch posts in relevant UQ Facebook groups/course Discords once the MVP has real partner events in it
- [ ] Recruit 1–2 campus ambassadors from your launch-partner societies once the app has real usage
- [ ] Plan a physical presence moment (flyers/QR codes at the library or Union, a market-day stall if UQU allows) for the Phase 2–3 window
- [ ] Build a short demo video/screenshots (using Track C's assets) for society Facebook groups
- [ ] **Ongoing weekly**: check analytics for drop-off, personally message any partner society that's gone quiet

**Depends on**: Track B having something real to show, Track C having assets, Track D having partner content already in the feed so new visitors don't land on an empty app.

---

## Track G — Infrastructure & ops

Mostly short setup tasks, front-loaded, then a light ongoing habit.

- [ ] Repo, CI, project board (done — in the scaffold)
- [ ] Enable Supabase automatic backups as soon as any real user data exists
- [ ] Wire up error monitoring (Sentry or similar) from Engineering Phase 2 onward
- [ ] Set up basic analytics (Plausible/Vercel Analytics)
- [ ] **Ongoing**: watch uptime/errors, especially around semester-start (O-week) traffic spikes

---

## Suggested weekly rhythm (solo)

A concrete way to actually interleave these without losing momentum on the code:

| When | What |
|---|---|
| Start of each week | 15–20 min: check Track D/F — any outreach or follow-ups due? |
| Daily | Bulk of time on Track B (current day/phase from `DAY_BY_DAY_PLAN.md`) |
| As each screen is built | Track C copy pass before calling it "done," not after |
| Before each phase that touches user data or messaging | Check Track E's checklist for that phase — it's listed above as a dependency for a reason |
| End of each week | 15 min: log any unprompted feedback into the Track A running doc |

The goal isn't perfect parallelism — it's making sure partnerships, legal groundwork, and growth aren't things you "get to eventually," since by the time engineering is done, the app being empty of real events or missing a privacy policy would block the exact launch moment you built everything for.
