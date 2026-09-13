-- Replace 'ADMIN_EMAIL_HERE' with the actual admin email before running this
-- in Supabase's SQL Editor. Not committed with a real value to keep the
-- admin's personal email out of public git history — see ADMIN_EMAIL in
-- .env.local for the value actually in use.

create policy "Admin can view all events regardless of status"
  on events for select
  using (auth.jwt() ->> 'email' = 'ADMIN_EMAIL_HERE');

create policy "Admin can update event status"
  on events for update
  using (auth.jwt() ->> 'email' = 'ADMIN_EMAIL_HERE');
