create table event_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table interest_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  category text,
  created_at timestamptz not null default now()
);

create table interest_post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references interest_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table event_messages enable row level security;
alter table interest_posts enable row level security;
alter table interest_post_likes enable row level security;

create policy "Event messages viewable by everyone"
  on event_messages for select using (true);
create policy "Authenticated users can post event messages"
  on event_messages for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Interest posts viewable by everyone"
  on interest_posts for select using (true);
create policy "Authenticated users can create interest posts"
  on interest_posts for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Likes viewable by everyone"
  on interest_post_likes for select using (true);
create policy "Authenticated users can like posts"
  on interest_post_likes for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Users can remove their own like"
  on interest_post_likes for delete to authenticated
  using (auth.uid() = user_id);
