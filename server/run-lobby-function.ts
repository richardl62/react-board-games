import { ParsedQs } from 'qs';
import { Matches } from './matches.js';
import { ServerLobby } from './server-lobby.js';

export function runLobbyFunction(matches: Matches, query: ParsedQs) : unknown {
  
  const func = query.func;
  if(typeof func !== "string") {
    throw new Error("Function name missing or invalid in call to lobby");
  }

  let arg: unknown = null;
  if(typeof query.arg === "string") {
    arg = JSON.parse(query.arg);
  }
  if (typeof arg !== "object") {
    throw new Error("Parameter missing or invalid in call to lobby");
  }

  // TO DO: Refactor to properly fix the lint errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lobby : any = new ServerLobby(matches);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if(typeof (lobby)[func] === "function") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return (lobby)[func](arg);
  }

  throw new Error('Lobby function not implemented.');
}
