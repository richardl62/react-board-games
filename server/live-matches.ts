import { ActiveMatchState } from '../shared/match-state.js';
import { isMatchOptions, MatchOptions } from '../shared/match-options.js';
import { isCtxData } from '../shared/game-control/ctx.js';
import { sAssert } from '../shared/utils/assert.js';
import { selectRows, upsertRow } from './supabase.js';

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

// Return the saved record of the given match, or null if there is none.
export async function loadLiveMatch(id: string): Promise<LiveMatchRecord | null> {
  const rows = await selectRows(
    'live_matches',
    `select=id,game,state_version,data&id=eq.${encodeURIComponent(id)}`,
  );
  if (rows.length === 0) {
    return null;
  }
  sAssert(rows.length === 1, `Multiple saved records for match ${id}`);

  const { game, state_version, data } = rows[0];
  sAssert(typeof game === 'string', `Saved match ${id} has invalid game`);
  sAssert(
    typeof state_version === 'number' && Number.isInteger(state_version),
    `Saved match ${id} has invalid state version`,
  );
  sAssert(isSavedMatch(data), `Saved match ${id} has invalid data`);

  return { id, game, stateVersion: state_version, data };
}

// A quick check that the data has the expected structure. (It is written only by
// this server, so a full check is not needed.)
function isSavedMatch(obj: unknown): obj is SavedMatch {
  if (typeof obj !== 'object' || obj === null) return false;

  const candidate = obj as SavedMatch;
  return (
    isMatchOptions(candidate.matchOptions) &&
    typeof candidate.activeData === 'object' &&
    candidate.activeData !== null &&
    isCtxData(candidate.activeData.ctxData) &&
    typeof candidate.activeData.prngState === 'number' &&
    Array.isArray(candidate.players) &&
    candidate.players.every(
      (p) =>
        typeof p.id === 'string' &&
        (p.name === null || typeof p.name === 'string') &&
        typeof p.credentials === 'string' &&
        typeof p.wantsRematch === 'boolean',
    ) &&
    (candidate.rematchSeed === null || typeof candidate.rematchSeed === 'number') &&
    Number.isInteger(candidate.gameNumber)
  );
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
