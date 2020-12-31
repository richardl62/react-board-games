import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './app.css';

import BoardGame from './game';
import gameDefinitions from './game-definition';

const localServer=false; // If true, play is limited to a single browser.  
const nPlayersPerBrowser= localServer ? 2 : 1;

let games = gameDefinitions.map(gameDef => {
  const gamePage = gameDef.name.replace(/\s/g, ''); // Remove any whitespace
  return {
    component: () => (<BoardGame 
        gameDefinition={gameDef} 
        localServer={localServer} 
        nPlayersPerBrowser={nPlayersPerBrowser}
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
          <Link className="game-link" to={g.path}>{g.name}</Link>
          </li>);
        }
      )}
    </ul>
  );
}

function HomePage () {
  return (
    <div>
      <h2>Available games</h2>
      <GameLinks />
    </div>
  )
}

function PageNotFound () {
  return (
    <div className="page-not-found">
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
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;
