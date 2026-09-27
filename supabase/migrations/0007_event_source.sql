alter table events add column source text not null default 'manual' check (source in ('manual', 'ingested'));
