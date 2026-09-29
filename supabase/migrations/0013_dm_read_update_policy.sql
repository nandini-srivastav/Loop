create policy "Recipients can mark messages as read"
  on direct_messages for update
  to authenticated
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);
