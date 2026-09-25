-- Migration for a match archive created before archive versions were added.
-- (A new archive should be created with archive-schema.sql, which includes this.)
--
-- Run once in the Supabase dashboard (SQL Editor) BEFORE deploying a server
-- that writes archive_version.
--
-- Existing matches were all saved before versions existed, so they are
-- version 1. The default is then dropped so that a save without a version fails
-- rather than being silently recorded as version 1.

alter table public.matches add column archive_version integer not null default 1;
alter table public.matches alter column archive_version drop default;
