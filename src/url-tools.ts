// The host used by 'npm start'
const npmStartHost = "localhost:3000";

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
  
      if(val === '' || val === 'true') {
        return true;
      } else if (val === 'false') {
        return false;
      } else {
        return val;
      }
    }
  
    function localMode() {
      let local = removeParam('local');
      if (local === null) {
        // Kludge: Decide whether to run locally or not depending on the host
        return window.location.host === npmStartHost;
      }
      return Boolean(local);
    }
  
    function playersPerBrowser() {
      const ppb = removeParam('ppb');
      if(ppb === null)
        return 1;
      
      if(typeof ppb === 'string') {
        const val = parseInt(ppb);
        if(!isNaN(val) && val >= 1) {
          return val;
        }
      }
    
      console.log("Warning: Bad parameter for search parameter ppb (number expected)");
      return 1;
    }
  
    function bgioDebug() {
      const bgd = removeParam('bgio-debug');
      if(bgd === null) {
        return false;
      }
  
      if(typeof bgd === 'boolean') {
        return bgd;
      }
    
      console.log("Warning: Bad parameter for search parameter bgio-debug (boolean or nothing expected)");
      return false;
    }

    function server() {
      let { protocol, hostname, port } = location;
      
      if(window.location.host === npmStartHost) {
        // KLUDGE? In general, the server should be running on the current port.
        // But in this special case look for a separate server running on port 8000.
        port = "8000";
      }
    
      return `${protocol}//${hostname}:${port}`;
    };
  
    const result = {
      localMode: localMode(),
      playerPerBrowser: playersPerBrowser(),
      bgioDebugPanel: bgioDebug(),
      server: server(),
    }
  
    if(searchParams.toString()) {
      console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
    }
    return result;
  }

  export { processLocation }