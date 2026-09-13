# apps/scraper

Python ingestion service: pulls events from partner submission webhooks and (once ToS review is complete) approved external sources, structures them via the Claude API, dedupes, and writes to the moderation queue table in Supabase.

Suggested layout:
```
scraper/
  sources/        # one module per data source
  extract.py       # raw text -> structured event via Claude API
  dedupe.py
  main.py           # scheduler entrypoint
requirements.txt
```
