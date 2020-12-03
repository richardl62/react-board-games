import React, { FunctionComponent } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Chess from './chess/chess';
import Bobail from './bobail';
import './app.css';

const homePage = "react-board-games";

function ChessStandard() {

  const pieces  = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

  return <Chess pieces={pieces} />
}



function Chess5ASide() {

    const pieces = [
        ['r', 'n', 'b', 'q', 'k'],
        ['p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null],
        [null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K'],
    ];

  return <Chess pieces={pieces} />
}

function Draughts() {
  return <h2>Draughts: Not yet implemented</h2>
}

function Draughts10x10() {
  return <h2>Draughts10x10: Not yet implemented</h2>
}


// Functions and display name
type GameAndDisplayName = [FunctionComponent, string];
const GameAndDisplayNames: Array<GameAndDisplayName> = [
  [ChessStandard, "chess"],
  [Chess5ASide, "chess 5-a-side"],
  [Draughts, "draughts"],
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
