import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from './tools';
import styles from './app.module.css';

import BoardGame from './game';
import gameDefinitions from './game-definition';
import Lobby from './lobby';

function getParamsFromURL() {

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

  function local() {
    const l = removeParam('local');
    if (l === null) {
      // Kludge: Decide whether to run locally or not depending on the host
      return window.location.host === "localhost:3000";
    } else {
      return Boolean(l);
    }
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
    localServer: local(),
    playerPerBrowser: playersPerBrowser(),
    bgioDebugPanel: bgioDebug(),
  }

  if(searchParams.toString()) {
    console.log("WARNING: Unprocessed URL search parameters", searchParams.toString());
  }
  return result;
}

const urlParam = getParamsFromURL();

let games = gameDefinitions.map(gameDef => {
  const gamePage = gameDef.name.replace(/\s/g, ''); // Remove any whitespace
  return {
    component: () => (<BoardGame
      gameDefinition={gameDef}
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
      <Link className={nonNull(styles.gameLink)} to="/Lobby">Lobby (experimental)</Link>
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
  return (
    <Switch>
      <Route key="/" exact path="/" component={HomePage} />
      {games.map(g =>
        <Route key={g.path} exact path={g.path} component={g.component} />,
      )}
      <Route key="lobby" exact path="/lobby" component={Lobby} />
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;
