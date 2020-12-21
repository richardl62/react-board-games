import React, { FunctionComponent } from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import {ChessStandard, Chess5ASide, DraughtsStandard, Draughts10x10, Bobail } from './games';
import './app.css';

const homePage = "react-board-games";




// Functions and display name
type GameAndDisplayName = [FunctionComponent, string];
const GameAndDisplayNames: Array<GameAndDisplayName> = [
  [ChessStandard, "chess"],
  [Chess5ASide, "chess 5-a-side"],
  [DraughtsStandard, "draughts"],
  [Draughts10x10, "draughts 10x10"],
  [Bobail, "bobail"],
];

const games = GameAndDisplayNames.map(([component, displayName]) => {
  const gamePage = displayName.replace(/\s/g, ''); // Remove add whitespace

  return {
    component: component,
    displayName: displayName,
    path: `/${homePage}/${gamePage}`,
  }
});

function GameLinks() {
  return (
    <ul>
      {games.map(g => {
        return (<li key={g.path}>
          <Link className="game-link" to={g.path}>{g.displayName}</Link>
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
      <Route key="react-board-games" exact path="/react-board-games" component={HomePage} />
      {games.map(g =>
        <Route key={g.path} exact path={g.path} component={g.component} />,
      )}
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;
