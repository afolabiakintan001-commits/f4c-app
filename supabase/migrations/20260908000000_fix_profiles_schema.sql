-- Add missing full_name and avatar_url columns if they don't exist
alter table public.profiles 
  add column if not exists full_name text,
  add column if not exists avatar_url text,
  add column if not exists points integer default 500 not null;

-- Ensure RLS is enabled and proper policy exists
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." 
  on public.profiles for select using (true);

create policy "Users can update own profile." 
  on public.profiles for update using (auth.uid() = id);
