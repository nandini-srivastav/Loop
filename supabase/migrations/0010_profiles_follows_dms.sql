alter table profiles add column username text unique;
alter table profiles add column bio text;
alter table profiles add column age integer;
alter table profiles add column gender text;
alter table profiles add column pursuing text;
alter table profiles add column hobbies text;
alter table profiles add column avatar_url text;

alter table interest_posts add column is_anonymous boolean not null default false;
alter table event_messages add column is_anonymous boolean not null default false;

create table follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  followee_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, followee_id),
  check (follower_id != followee_id)
);

alter table follows enable row level security;

create policy "Follows are viewable by everyone"
  on follows for select using (true);
create policy "Users can follow others"
  on follows for insert to authenticated
  with check (auth.uid() = follower_id);
create policy "Users can unfollow"
  on follows for delete to authenticated
  using (auth.uid() = follower_id);

create table direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table direct_messages enable row level security;

create policy "Users can view their own DMs"
  on direct_messages for select to authenticated
  using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send DMs if mutually followed"
  on direct_messages for insert to authenticated
  with check (
    auth.uid() = sender_id
    and exists (select 1 from follows where follower_id = sender_id and followee_id = recipient_id)
    and exists (select 1 from follows where follower_id = recipient_id and followee_id = sender_id)
  );
