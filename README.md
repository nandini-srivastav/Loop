# Loop

> Every UQ event, one place. Stop finding out about it after it happened.

Loop aggregates society, department, careers, and cultural events from across the University of Queensland into a single feed, with lightweight social tools (event-scoped chat, partner-finding posts), a student marketplace, and personalised recommendations.

**Status:** early / pre-alpha — see [PLAN.md](./PLAN.md) for what's being worked on day by day, and [REFERENCE.md](./REFERENCE.md) for architecture/scope background.

## Why

UQ event info is scattered across dozens of society Instagram pages, department sites, and UQU channels. New students in particular miss events they'd have wanted to attend simply because they didn't follow the right account. Loop fixes the discovery problem first, then builds useful things around it.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend / Auth / DB / Realtime | Supabase (Postgres) |
| Maps | Google Maps deep links |
| Ingestion service | Python (Playwright) |
| AI extraction & recommendations | Claude API |

Full rationale in [REFERENCE.md](./REFERENCE.md#5-suggested-tech-stack).

## Project structure

```
apps/
  web/        # Next.js frontend
  scraper/    # Python ingestion service
packages/
  ui/         # shared UI components
docs/         # architecture notes, ADRs
```

## Getting started

```bash
git clone https://github.com/nandini-srivastav/loop.git
cd loop/apps/web
cp .env.example .env.local   # fill in Supabase + Maps + Claude API keys
npm install
npm run dev
```

## Contributing

Contributions welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Look for issues labeled [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## Plan

See [PLAN.md](./PLAN.md) for the day-by-day build plan. See [REFERENCE.md](./REFERENCE.md) for tech stack, data model, and sourcing-strategy background.

## License

MIT — see [LICENSE](./LICENSE).
