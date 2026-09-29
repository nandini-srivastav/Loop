create policy "Anyone can view event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

create policy "Authenticated users can upload event images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-images');

alter table events add column image_url text;
