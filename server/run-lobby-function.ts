import { ParsedQs } from 'qs';
import { Matches } from './matches.js';
import { ServerLobby } from './server-lobby.js';

export async function runLobbyFunction(matches: Matches, query: ParsedQs): Promise<unknown> {
  const func = query.func;
  if (typeof func !== 'string') {
    throw new Error('Function name missing or invalid in call to lobby');
  }

  let arg: unknown = null;
  if (typeof query.arg === 'string') {
    arg = JSON.parse(query.arg);
  }
  if (typeof arg !== 'object') {
    throw new Error('Parameter missing or invalid in call to lobby');
  }

  // If the function refers to a match that isn't in memory (e.g. after a server
  // restart), restore it first. The lobby functions themselves are synchronous.
  if (arg !== null && 'matchID' in arg && typeof arg.matchID === 'string') {
    await matches.ensureLoaded(arg.matchID);
  }

  const lobby = new ServerLobby(matches);
  const method = (lobby as unknown as Record<string, unknown>)[func];
  if (typeof method === 'function') {
    return (method as (arg: unknown) => unknown).call(lobby, arg);
  }

  throw new Error('Lobby function not implemented.');
}
