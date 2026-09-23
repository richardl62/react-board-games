import { isMatchState, MatchState } from '@shared/match-state';
import { sAssert } from '@shared/utils/assert';

// Read access to the online match archive (a Supabase table - see
// docs/archive-schema.sql). Matches are saved by the server; the client
// only reads them, using the public (publishable) key.

// The number of matches returned by listArchivedMatches.
const listLimit = 50;

export interface ArchivedMatchSummary {
  id: string;
  game: string; // GameControl.name
  players: (string | null)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchivedMatch {
  game: string; // GameControl.name
  updatedAt: Date;
  matchState: MatchState;
}

/** The most recently updated archived matches, newest first */
export async function listArchivedMatches(): Promise<ArchivedMatchSummary[]> {
  const rows = await fetchRows(
    `select=id,game,players,created_at,updated_at&order=updated_at.desc&limit=${listLimit}`,
  );

  return rows.map((row) => {
    const { id, game, players, created_at, updated_at } = row;
    sAssert(typeof id === 'string', 'Archived match has invalid id');
    sAssert(typeof game === 'string', 'Archived match has invalid game');
    sAssert(isPlayerNames(players), 'Archived match has invalid players');

    return { id, game, players, createdAt: toDate(created_at), updatedAt: toDate(updated_at) };
  });
}

export async function fetchArchivedMatch(id: string): Promise<ArchivedMatch> {
  const rows = await fetchRows(
    `select=game,updated_at,match_state&id=eq.${encodeURIComponent(id)}`,
  );
  if (rows.length === 0) {
    throw new Error('Saved game not found');
  }
  sAssert(rows.length === 1, 'Unexpected number of archived matches found');

  const { game, updated_at, match_state } = rows[0];
  sAssert(typeof game === 'string', 'Archived match has invalid game');
  sAssert(isMatchState(match_state), 'Archived match has invalid match state');

  return { game, updatedAt: toDate(updated_at), matchState: match_state };
}

// Run a PostgREST query on the matches table.
async function fetchRows(query: string): Promise<Record<string, unknown>[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  sAssert(
    url && key,
    'VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY are not set (see .env.example)',
  );

  const response = await fetch(`${url}/rest/v1/matches?${query}`, { headers: { apikey: key } });
  if (!response.ok) {
    throw new Error(`Match archive request failed: ${response.status} ${await response.text()}`);
  }

  const rows: unknown = await response.json();
  sAssert(Array.isArray(rows), 'Match archive returned unexpected data');
  return rows as Record<string, unknown>[];
}

function isPlayerNames(obj: unknown): obj is (string | null)[] {
  return Array.isArray(obj) && obj.every((name) => name === null || typeof name === 'string');
}

function toDate(obj: unknown): Date {
  sAssert(typeof obj === 'string', 'Archived match has invalid timestamp');
  const date = new Date(obj);
  sAssert(!isNaN(date.getTime()), 'Archived match has invalid timestamp');
  return date;
}
