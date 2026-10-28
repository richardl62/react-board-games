import { ActiveMatchState } from '../shared/match-state.js';
import { MatchOptions } from '../shared/match-options.js';
import { upsertRow } from './supabase.js';

// Saves live matches to a private Supabase table (see docs/live-matches-schema.sql)
// so that they can be restored after a server restart. Unlike the match archive,
// this includes player credentials, so the table must never be publicly readable.

export interface SavedPlayer {
  id: string;
  name: string | null;
  credentials: string;
  gameData?: unknown;
  wantsRematch: boolean;
}

// Everything needed to restore a match. (Transient data such as connections is
// not included.)
export interface SavedMatch {
  setupData: unknown;
  matchOptions: MatchOptions;
  activeData: ActiveMatchState;
  players: SavedPlayer[];
  rematchSeed: number | null;
  gameNumber: number;
}

export interface LiveMatchRecord {
  id: string; // Match.matchID
  game: string; // GameControl.name
  stateVersion: number; // GameControl.stateVersion
  data: SavedMatch;
}

// Insert or update (keyed on id) a live match record.
export async function saveLiveMatch(record: LiveMatchRecord, updatedAt: Date): Promise<void> {
  await upsertRow('live_matches', {
    id: record.id,
    game: record.game,
    state_version: record.stateVersion,
    updated_at: updatedAt.toISOString(),
    data: record.data,
  });
}
