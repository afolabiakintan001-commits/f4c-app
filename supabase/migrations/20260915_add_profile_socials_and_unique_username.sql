-- Add social handles columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS instagram_handle text,
  ADD COLUMN IF NOT EXISTS x_handle text,
  ADD COLUMN IF NOT EXISTS portfolio_url text;

-- Add UNIQUE constraint to username
-- First, ensure no duplicates exist (a safe measure)
-- This might fail if duplicates exist; manual cleanup would be needed.
-- For this automated context, I will assume username uniqueness is desired and proceed.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_unique UNIQUE (username);
