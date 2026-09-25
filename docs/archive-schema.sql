-- Schema for the match archive (Supabase / Postgres).
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- The server writes with the secret (service role) key, which bypasses RLS.
-- Browsers, including the static GitHub Pages build, read with the public
-- (anon / publishable) key, which RLS restricts to SELECT only.

create table public.matches (
  id          text        primary key,
  game        text        not null,
  players     jsonb       not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- GameControl.archive.version of the game when the match was saved.
  archive_version integer not null,
  match_state jsonb       not null
);

create index matches_updated_at_idx on public.matches (updated_at desc);

alter table public.matches enable row level security;

create policy "Anyone can read matches"
  on public.matches
  for select
  to anon, authenticated
  using (true);

-- Explicit grants: harmless if Supabase's defaults already cover them.
grant select on public.matches to anon, authenticated;
revoke insert, update, delete on public.matches from anon, authenticated;
grant select, insert, update, delete on public.matches to service_role;
