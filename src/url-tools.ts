function boolFromParam(param: string | null) {
  if (param === '' || param === 'true') {
    return true;
  } 
  
  if (param === 'false') {
    return false;
  }

  return null;
}

function getOptionsFromLocation(location: Location) {

  const searchParams = new URLSearchParams(location.search);

  // Remove the search parameter with the given name and return it's value.
  // Special return values:
  //    null if parameter is not specified.
  //    true if the parameter is not give a value.
  //    true/false if the parameter is 'true'/'false'.
  const removeParam = (name: string) => {
    const val = searchParams.get(name);
    searchParams.delete(name);
    return val;
  }

  function servers() {
    const local = location.origin;
    let remote = local;
    if (remote === "http://localhost:3000") {
      console.log("HACK: Artificially setting server for local host");
      remote = "http://localhost:8000";
    }
    return { game: local, lobby: remote };
  }

  function playersPerBrowser() {
    const ppb = removeParam('ppb');
    if (ppb === null)
      return 1;

    const val = parseInt(ppb);
    if (!isNaN(val) && val >= 1) {
      return val;
    }

    console.log("Warning: Bad parameter for search parameter ppb (number expected)");
    return 1;
  }

  function bgioDebug() {
    const bgdParam = removeParam('bgio-debug');
    if (bgdParam === null) {
      return false;
    }

    const bgdBool = boolFromParam(bgdParam);
    if (bgdBool !== null) {
      return bgdBool;
    }

    console.log("Warning: Bad parameter for search parameter bgio-debug (boolean or nothing expected)");
    return false;
  }

  function lobbyGame() {
    return removeParam('game');
  }

  const result = {
    servers: servers(),
    playersPerBrowser: playersPerBrowser(),
    bgioDebugPanel: bgioDebug(),
    lobbyGame: lobbyGame(),
  }

  if (searchParams.toString()) {
    console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
  }
  return result;
}

function gamePath(game: string) {
  return `/${game}`;
}

function lobbyPath(game: string) {
  return "/lobby?game=" + game;
}
export { getOptionsFromLocation, gamePath, lobbyPath }
