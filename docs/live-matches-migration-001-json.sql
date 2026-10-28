-- Migration for a live_matches table created with 'data' as jsonb.
-- (A new table should be created with live-matches-schema.sql, which includes this.)
--
-- jsonb does not preserve the order of object keys, so a restored match would not
-- match the original exactly. Run once in the Supabase dashboard (SQL Editor).
-- Any existing rows keep their (already reordered) data.

alter table public.live_matches alter column data type json using data::json;
