import { AppOptions, MatchID } from "./types";

function getPlayersPerBrowser(usp: URLSearchParams) {
  const key = 'ppb';
  if(usp.has(key)) {
    const str = usp.get(key);
    usp.delete(key);

    const res = Number(str);
    if(res >= 1 && res <= 1000) { // Arbitrary limit
      return res;
    }

    console.log(`Bad value for URL parameter ${key}: ${str}`);
  };

  return 1;
}

function getBgioDebugPanel(usp: URLSearchParams) {
  const key = 'debug-panel';
  if(usp.has(key)) {
    const str = usp.get(key);
    usp.delete(key);

    if (str === '' || str=== 'true') {
      return true;
    }

    if (str === 'false') {
      return false;
    }

    console.log(`Bad value for URL parameter ${key}: ${str}`);
  };

  return false;
}

const matchKeys = {
  id: 'matchID',
  local: 'local',
};

function getMatch(usp: URLSearchParams) {
  if (usp.has(matchKeys.id)) {
    const id=usp.get(matchKeys.id);
    usp.delete(matchKeys.id);
    return {mid: id!};
  }

  return null;
}

function getURLOptions() : Partial<AppOptions> {
  const sp = new URLSearchParams(window.location.search);

  const result : Partial<AppOptions> = {
    playersPerBrowser: getPlayersPerBrowser(sp),
    bgioDebugPanel: getBgioDebugPanel(sp),
    matchID: getMatch(sp),
  }

  if (sp.toString()) {
    console.log("Unrecongised url parameters", sp.toString())
  }

  return result;
}

function setURLMatchParams(matchID: MatchID | null) {
  let url = new URL(window.location.href);
  let searchParams = new URLSearchParams(url.search);

  searchParams.delete(matchKeys.id);
  if(matchID) {
    searchParams.set(matchKeys.id, matchID.mid);
  }

  url.search = searchParams.toString();
  window.location.href = url.href;
}

function lobbyServer() { 
  return 'http://localhost:8000'; // KLUDGE
}

export { getURLOptions, lobbyServer, setURLMatchParams }
