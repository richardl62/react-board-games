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
  archiveVersion: number; // GameControl.archive.version when the match was saved
  matchState: MatchState;
}

// The current archive version of a game (i.e. GameControl.archive.version)
export interface ArchiveGameVersion {
  game: string; // GameControl.name
  version: number;
}

// How the archive version of saved matches compares to the current version.
export interface ArchiveVersionCounts {
  // Saved with an older version of the game.
  older: number;
  // Saved with a newer version of the game (e.g. when this page is out of date).
  newer: number;
  // Of a game that is not in 'currentVersions', e.g. because it is no longer archived.
  notArchived: number;
}

/** The most recently updated archived matches that were saved with the current
 * version of their game, newest first */
export async function listArchivedMatches(
  currentVersions: ArchiveGameVersion[],
): Promise<ArchivedMatchSummary[]> {
  const rows = await fetchRows(
    'select=id,game,players,created_at,updated_at' +
      `&or=${versionsFilter(currentVersions, 'eq')}` +
      `&order=updated_at.desc&limit=${listLimit}`,
  );

  return rows.map((row) => {
    const { id, game, players, created_at, updated_at } = row;
    sAssert(typeof id === 'string', 'Archived match has invalid id');
    sAssert(typeof game === 'string', 'Archived match has invalid game');
    sAssert(isPlayerNames(players), 'Archived match has invalid players');

    return { id, game, players, createdAt: toDate(created_at), updatedAt: toDate(updated_at) };
  });
}

/** Count the archived matches that were not saved with the current version of their game */
export async function countOtherVersionMatches(
  currentVersions: ArchiveGameVersion[],
): Promise<ArchiveVersionCounts> {
  const archivedGames = currentVersions.map(({ game }) => checkedGameName(game)).join(',');

  const [older, newer, notArchived] = await Promise.all([
    countRows(`or=${versionsFilter(currentVersions, 'lt')}`),
    countRows(`or=${versionsFilter(currentVersions, 'gt')}`),
    countRows(`game=not.in.(${archivedGames})`),
  ]);

  return { older, newer, notArchived };
}

export async function fetchArchivedMatch(id: string): Promise<ArchivedMatch> {
  const rows = await fetchRows(
    `select=game,updated_at,archive_version,match_state&id=eq.${encodeURIComponent(id)}`,
  );
  if (rows.length === 0) {
    throw new Error('Saved game not found');
  }
  sAssert(rows.length === 1, 'Unexpected number of archived matches found');

  const { game, updated_at, archive_version, match_state } = rows[0];
  sAssert(typeof game === 'string', 'Archived match has invalid game');
  sAssert(
    typeof archive_version === 'number' && Number.isInteger(archive_version),
    'Archived match has invalid archive version',
  );
  sAssert(isMatchState(match_state), 'Archived match has invalid match state');

  return {
    game,
    updatedAt: toDate(updated_at),
    archiveVersion: archive_version,
    matchState: match_state,
  };
}

// Run a PostgREST query on the matches table.
async function queryMatches(query: string, init: RequestInit = {}): Promise<Response> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  sAssert(
    url && key,
    'VITE_SUPABASE_URL and/or VITE_SUPABASE_PUBLISHABLE_KEY are not set (see .env.example)',
  );

  const response = await fetch(`${url}/rest/v1/matches?${query}`, {
    ...init,
    headers: { ...init.headers, apikey: key },
  });
  if (!response.ok) {
    throw new Error(`Match archive request failed: ${response.status} ${await response.text()}`);
  }
  return response;
}

async function fetchRows(query: string): Promise<Record<string, unknown>[]> {
  const response = await queryMatches(query);

  const rows: unknown = await response.json();
  sAssert(Array.isArray(rows), 'Match archive returned unexpected data');
  return rows as Record<string, unknown>[];
}

// Return the number of rows matching the query (without fetching them).
async function countRows(query: string): Promise<number> {
  const response = await queryMatches(query, {
    method: 'HEAD',
    headers: { Prefer: 'count=exact' },
  });

  // The count is given in the Content-Range header, e.g. "0-4/5" or "*/0".
  const count = Number(response.headers.get('Content-Range')?.split('/')[1]);
  sAssert(Number.isInteger(count), 'Match archive returned no valid count');
  return count;
}

// Return a PostgREST 'or' filter matching matches of any of the given games whose
// archive version compares to the game's version as specified, e.g. for 'eq'
// "(and(game.eq.scrabble,archive_version.eq.2),and(game.eq.scrabble-simple,archive_version.eq.2))"
function versionsFilter(versions: ArchiveGameVersion[], comparison: 'eq' | 'lt' | 'gt'): string {
  sAssert(versions.length > 0, 'No archived games');

  const terms = versions.map(
    ({ game, version }) =>
      `and(game.eq.${checkedGameName(game)},archive_version.${comparison}.${version})`,
  );
  return `(${terms.join(',')})`;
}

// Game names are used unquoted in PostgREST filters, so must not contain
// characters that are special to PostgREST (e.g. commas or brackets).
function checkedGameName(game: string): string {
  sAssert(/^[\w-]+$/.test(game), `Unexpected characters in game name "${game}"`);
  return game;
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
