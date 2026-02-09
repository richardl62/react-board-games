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

  // TO DO: Refactor to properly fix the lint errors. (Note: The lint
  // errors change when strict linting is enabled.)
  /* eslint-disable */
  const lobby : any = new ServerLobby(matches);
  if(typeof (lobby)[func] === "function") {
    return (lobby)[func](arg);
  }
  /* eslint-enable */

  throw new Error('Lobby function not implemented.');
}
