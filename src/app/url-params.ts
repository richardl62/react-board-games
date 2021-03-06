// Get values that can be set in the url.
// If not set, give default value.
import { AppGame, MatchID } from "../shared/types";

const usp = new URLSearchParams(window.location.search);

const getAndDelete = (key: string) => {
  const val = usp.get(key);
  usp.delete(key);
  return val;
}

function getAndDeleteFlag(key: string) : boolean {
  const falsey = [null, '0','false'];
  const truthy  = ['', '1','true'];

  const str = getAndDelete(key);

  if (falsey.includes(str)) {
    return false;
  }

  if (truthy.includes(str!)) {
    console.log(`Bad value for URL boolean ${str}`);
  }

  return true;
}


const ppb = getAndDelete('ppb')
export const playersPerBrowser = ppb ? parseInt(ppb) : 1;

export const bgioDebugPanel = getAndDeleteFlag('debug-panel')

const matchID_ = getAndDelete('match-id');
export const matchID : MatchID | null = matchID_ ? {mid: matchID_} : null;

const server = getAndDelete('server');
  
if (usp.toString()) {
  console.log("Unrecongised url parameters", usp.toString())
}

export function gamePath(game: AppGame) {
  return '/' + game.name;
}

export function openMatchPage(matchID: MatchID) {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  searchParams.set('match-id', matchID.mid);
  url.search = searchParams.toString();

  window.location.href = url.href;
}
export function lobbyServer() { 
  const url = new URL(window.location.href);
  let result;
  if(server) {
    result = server;
  } else {
    if(url.hostname === 'localhost' && url.port === '3000') {
      url.port = '8000'; // kludge
    };
    result = url.origin;
  }
  
  return result;
}

