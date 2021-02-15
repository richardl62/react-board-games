// The game server use in local mode. (The addres used by npm start)
const localModeGameServer = "http://localhost:3000";

// Lobby server optionally used in local mode. (The address used by npm run simple-server)
const localModeLobbyServer = "http://localhost:8000"

function processLocation(location: Location) {

  const runningLocally = location.origin === localModeGameServer;
  const searchParams = new URLSearchParams(location.search);

  // Remove the search parameter with the given name and return it's value.
  // Special return values:
  //    null if parameter is not specified.
  //    true if the parameter is not give a value.
  //    true/false if the parameter is 'true'/'false'.
  const removeParam = (name: string) => {
    const val = searchParams.get(name);
    searchParams.delete(name);

    if (val === '' || val === 'true') {
      return true;
    } else if (val === 'false') {
      return false;
    } else {
      return val;
    }
  }

  /* localMode */
  const localParam = removeParam('local');

  // Kludge?: The default for local mode depends on the host
  const localMode = (localParam === null) ? runningLocally : Boolean(localParam);

  /* servers */
  const servers = {
        game: location.origin,
        lobby: runningLocally ? localModeLobbyServer : location.origin,
      };
    
  function playersPerBrowser() {
    const ppb = removeParam('ppb');
    if (ppb === null)
      return 1;

    if (typeof ppb === 'string') {
      const val = parseInt(ppb);
      if (!isNaN(val) && val >= 1) {
        return val;
      }
    }

    console.log("Warning: Bad parameter for search parameter ppb (number expected)");
    return 1;
  }

  function bgioDebug() {
    const bgd = removeParam('bgio-debug');
    if (bgd === null) {
      return false;
    }

    if (typeof bgd === 'boolean') {
      return bgd;
    }

    console.log("Warning: Bad parameter for search parameter bgio-debug (boolean or nothing expected)");
    return false;
  }

  const result = {
    localMode: localMode,
    servers: servers,
    playerPerBrowser: playersPerBrowser(),
    bgioDebugPanel: bgioDebug(),

  }

  if (searchParams.toString()) {
    console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
  }
  return result;
}

export { processLocation }
