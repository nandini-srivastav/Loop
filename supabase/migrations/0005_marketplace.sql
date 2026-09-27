create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  price_type text not null check (price_type in ('fixed', 'free', 'loan')),
  price numeric,
  category text,
  status text not null default 'available' check (status in ('available', 'sold', 'loaned', 'removed')),
  created_at timestamptz not null default now()
);

create table listing_messages (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table listings enable row level security;
alter table listing_messages enable row level security;

create policy "Listings viewable by everyone"
  on listings for select using (status != 'removed');
create policy "Authenticated users can create listings"
  on listings for insert to authenticated
  with check (auth.uid() = seller_id);
create policy "Sellers can update their own listings"
  on listings for update to authenticated
  using (auth.uid() = seller_id);

create policy "Users can view messages on their own listings or that they sent"
  on listing_messages for select to authenticated
  using (
    auth.uid() = sender_id
    or auth.uid() in (select seller_id from listings where id = listing_id)
  );
create policy "Authenticated users can send listing messages"
  on listing_messages for insert to authenticated
  with check (auth.uid() = sender_id);
