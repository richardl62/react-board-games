-- Migration for a match archive created before match IDs changed from UUIDs
-- to short random strings (e.g. "k3x9q2m7ab").
-- (A new archive should be created with archive-schema.sql, which includes this.)
--
-- Run once in the Supabase dashboard (SQL Editor). Existing UUID IDs are kept
-- (as text), so links to already-saved matches continue to work.

alter table public.matches alter column id type text;
