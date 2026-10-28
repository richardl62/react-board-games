-- Schema for saved live matches (Supabase / Postgres), used to restore matches
-- after a server restart. See server/live-matches.ts.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- The saved data includes player credentials, so this table must NOT be readable
-- with the public (anon / publishable) key. Only the server, using the secret
-- (service role) key, has access.

create table public.live_matches (
  id            text        primary key, -- Match.matchID
  game          text        not null,
  -- GameControl.stateVersion of the game when the match was saved.
  state_version integer     not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- Everything needed to restore the match (SavedMatch in server/live-matches.ts).
  data          jsonb       not null
);

-- Row level security with no policies: no access other than via the secret key.
alter table public.live_matches enable row level security;

-- Grants are required for the table to be accessible through the Data API.
-- Deliberately, none are given to anon or authenticated.
revoke all on public.live_matches from anon, authenticated;
grant select, insert, update, delete on public.live_matches to service_role;
