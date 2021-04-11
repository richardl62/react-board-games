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

function getMatchID(usp: URLSearchParams) {
  const key = 'matchID';

  const str = usp.get(key);
  usp.delete(key);
  return str;
}

const sp = new URLSearchParams(window.location.search);
export const playersPerBrowser: number =  getPlayersPerBrowser(sp);
export const bgioDebugPanel: boolean = getBgioDebugPanel(sp);
export const matchIDFromURL: string|null = getMatchID(sp);
 

if (sp.toString()) {
  console.log("Unrecongised url parameters", sp.toString())
}

export function setMatchID(matchID: string) {
  let url = new URL(window.location.href);
  let seachParams = new URLSearchParams(url.search);
  if(seachParams.has('matchID')) {
    throw new Error("matchID is already set");
  }
  seachParams.set('matchID', matchID);
  url.search = seachParams.toString();
  
  window.location.href = url.href;
}
