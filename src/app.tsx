import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from './tools';
import styles from './app.module.css';

import BoardGame from './game';
import gameDefinitions from './game-definition';
import Lobby from './bgio-lobby';

// The host used by 'npm start'
const npmStartHost = "localhost:3000";

const urlParam = (function() {

  const searchParams = new URLSearchParams(window.location.search);

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

  const result = {
    localMode: localMode(),
    playerPerBrowser: playersPerBrowser(),
    bgioDebugPanel: bgioDebug(),
  }

  if(searchParams.toString()) {
    console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
  }
  return result;
})();

function gameServer() {
  let { protocol, hostname, port } = window.location;
  if(urlParam.localMode) {
    return null;
  }
  else if(window.location.host === npmStartHost) {
    // KLUDGE? In general, the server should be running on the current port.
    // But in this special case look for a separate server running on port 8000.
    port = "8000";
  }
  return `${protocol}//${hostname}:${port}`;
};

let games = gameDefinitions.map(gameDef => {
  const gamePage = gameDef.name.replace(/\s/g, ''); // Remove any whitespace
  return {
    component: () => (<BoardGame
      gameDefinition={gameDef}
      server={gameServer()}
      {...urlParam}
    />),
    name: gameDef.name,
    path: `/${gamePage}`,
  };
});

function GameLinks() {
  return (
    <ul>
      {games.map(g => {
        return (<li key={g.path}>
          <Link className={nonNull(styles.gameLink)} to={g.path}>{g.name}</Link>
        </li>);
      }
      )}
    </ul>
  );
}

function HomePage() {
  return (
    <div>
      <h2>Available games</h2>
      <GameLinks />
      <br/>
      {urlParam.localMode ? null :
        (<Link className={nonNull(styles.gameLink)} to="/Lobby">Lobby (experimental)</Link>) }
    </div>
  )
}

function PageNotFound() {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <GameLinks />
    </div>
  )
}

function App() {


  const server = gameServer();
  return (
    <Switch>
      <Route key="/" exact path="/" component={HomePage} />
      {games.map(g =>
        <Route key={g.path} exact path={g.path} component={g.component} />,
      )}

      {server ?
      (<Route key="lobby" exact path="/lobby" 
          component={()=><Lobby server={server}/>}
      />): null}
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;
