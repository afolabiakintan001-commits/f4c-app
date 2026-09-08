-- Add INSERT policy to public.profiles to allow upserts
create policy "Users can insert own profile."
  on public.profiles for insert with check (auth.uid() = id);
