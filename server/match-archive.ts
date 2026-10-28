import { MatchState } from '../shared/match-state.js';
import { upsertRow } from './supabase.js';

// Saves match states to the online match archive (a Supabase table - see
// docs/archive-schema.sql) so that matches can be reviewed later.

export interface ArchiveRecord {
  id: string;
  game: string;
  players: (string | null)[];
  archiveVersion: number; // GameControl.stateVersion
  matchState: MatchState;
}

// Insert or update (keyed on id) a match record.
export async function saveMatch(record: ArchiveRecord, updatedAt: Date): Promise<void> {
  await upsertRow('matches', {
    id: record.id,
    game: record.game,
    players: record.players,
    updated_at: updatedAt.toISOString(),
    archive_version: record.archiveVersion,
    match_state: record.matchState,
  });
}
