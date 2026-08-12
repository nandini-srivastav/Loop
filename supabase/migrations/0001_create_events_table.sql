create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null check (category in ('society', 'careers', 'cultural', 'academic', 'sport')),
  start_time timestamptz not null,
  end_time timestamptz,
  venue_name text not null,
  venue_address text not null,
  organiser text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "Approved events are viewable by everyone"
  on events for select
  using (status = 'approved');

create policy "Authenticated users can submit events"
  on events for insert
  to authenticated
  with check (auth.uid() = created_by);
