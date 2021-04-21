// Get values that can be set in the url.
// If not set, give default value.
import { MatchID } from "./types";

function parseBool(str: string) {
    if (str === '' || str=== 'true') {
      return true;
    }

    if (str === 'false') {
      return false;
    }

    console.log(`Bad value for URL boolean ${str}`);
    return false;
}


const usp = new URLSearchParams(window.location.search);

const getAndDelete = (key: string) => {
  const val = usp.get(key);
  usp.delete(key);
  return val;
}

const ppb = getAndDelete('ppb')
export const playersPerBrowser = ppb ? parseInt(ppb) : 1;

const debugPanel = getAndDelete('debug-panel')
export const bgioDebugPanel = debugPanel ? parseBool(debugPanel) : false;

const matchID_ = getAndDelete('match-id');
export const matchID : MatchID | null = matchID_ ? {mid: matchID_} : null;

const server = getAndDelete('server');
  
if (usp.toString()) {
  console.log("Unrecongised url parameters", usp.toString())
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
  } else if(url.hostname === 'localhost') {
    result = 'http://localhost:8000'; // KLUDGE
  } else {
    result = window.location.href;
  }
  
  console.log("lobbyServer:", result);
  return result;
}

