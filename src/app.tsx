import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from './tools';
import styles from './app.module.css';

import BoardGame from './game';
import gameDefinitions from './game-definition';

const multiplayerMode = 'auto'; // 'local', 'remote' or 'auto'
const nPlayersLocal = 1;
const bgioDebugPanel = false;

let games = gameDefinitions.map(gameDef => {
  const gamePage = gameDef.name.replace(/\s/g, ''); // Remove any whitespace
  return {
    component: () => (<BoardGame
      gameDefinition={gameDef}
      multiplayerMode={multiplayerMode}
      nPlayersLocal={nPlayersLocal}
      bgioDebugPanel={bgioDebugPanel}
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
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;
