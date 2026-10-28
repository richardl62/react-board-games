import { sAssert } from '../shared/utils/assert.js';

// Server access to the Supabase database (see docs/*.sql). Uses the secret
// (service role) key, which bypasses row level security, so must only be used
// on the server.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseServiceKey);
if (!isSupabaseEnabled) {
  // See .env.example for details of how to set these.
  console.warn(
    'SUPABASE_URL and/or SUPABASE_SERVICE_KEY environment variables are not set. ',
    'Matches will not be archived, or saved so that they survive a server restart.',
  );
}

// Return the rows of the given table that match a PostgREST query, e.g.
// "select=id,data&id=eq.abc".
export async function selectRows(table: string, query: string): Promise<Record<string, unknown>[]> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase is not enabled');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: { apikey: supabaseServiceKey },
  });

  if (!response.ok) {
    throw new Error(`Read from ${table} failed: ${response.status} ${await response.text()}`);
  }

  const rows: unknown = await response.json();
  sAssert(Array.isArray(rows), `Unexpected data read from ${table}`);
  return rows as Record<string, unknown>[];
}

// Insert or update (keyed on the 'id' column) a row of the given table.
export async function upsertRow(table: string, row: Record<string, unknown>): Promise<void> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase is not enabled');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    throw new Error(`Save to ${table} failed: ${response.status} ${await response.text()}`);
  }
}
