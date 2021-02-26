function boolFromParam(param: string | null) {
  if (param === '' || param === 'true') {
    return true;
  } 
  
  if (param === 'false') {
    return false;
  }

  return null;
}

function processLocation(location: Location) {

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

  /* servers */
  const server = location.origin;
    
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

  const result = {
    server: server,
    playerPerBrowser: playersPerBrowser(),
    bgioDebugPanel: bgioDebug(),
  }

  if (searchParams.toString()) {
    console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
  }
  return result;
}

export { processLocation }