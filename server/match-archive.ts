import { MatchState } from '../shared/match-state.js';

// Saves match states to the online match archive (a Supabase table - see
// docs/archive-schema.sql) so that matches can be reviewed later.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

export const isArchiveEnabled = Boolean(supabaseUrl && supabaseServiceKey);
if (!isArchiveEnabled) {
  // See .env.example for details of how to set these.
  console.warn(
    'SUPABASE_URL and/or SUPABASE_SERVICE_KEY environment variables are not set. ',
    'Matches will not be archived.',
  );
}

export interface ArchiveRecord {
  id: string;
  game: string;
  players: (string | null)[];
  archiveVersion: number; // GameControl.archive.version
  matchState: MatchState;
}

// Insert or update (keyed on id) a match record.
export async function saveMatch(record: ArchiveRecord, updatedAt: Date): Promise<void> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Match archive is not enabled');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/matches?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      id: record.id,
      game: record.game,
      players: record.players,
      updated_at: updatedAt.toISOString(),
      archive_version: record.archiveVersion,
      match_state: record.matchState,
    }),
  });

  if (!response.ok) {
    throw new Error(`Archive save failed: ${response.status} ${await response.text()}`);
  }
}
