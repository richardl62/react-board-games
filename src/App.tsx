import React,{ FunctionComponent } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import './app.css';

function Chess() {
  return <h2>Chess: Not yet implemented</h2>
}

function Chess5ASide() {
  return <h2>Chess5ASide: Not yet implemented</h2>
}

function Draughts() {
  return <h2>Draughts: Not yet implemented</h2>
}

function Draughts10x10() {
  return <h2>Draughts10x10: Not yet implemented</h2>
}

function Bobail() {
  return <h2>Bobail: Not yet implemented</h2>
}

// Functions and display name
type GameAndDisplayName = [FunctionComponent, string];
const GameAndDisplayNames: Array<GameAndDisplayName> = [
  [Chess, "chess"],
  [Chess5ASide, "chess 5-a-side"],
  [Draughts, "draughts"],
  [Draughts10x10, "draughts 10x10"],
  [Bobail, "bobail"],
];

const games = GameAndDisplayNames.map(([component, displayName]) => {
  return {
    component: component,
    displayName: displayName,
    path: '/' + displayName.replace(/\s/g, ''), // Remove add whitespace
  }
});

function GameLinks() {
  return (
    <ul>
      {games.map(g => {
        return <li><Link to={g.path}>{g.displayName}</Link></li>
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
    <div>
      <h2 style={{color:"red"}}>404: Page Not Found</h2>
      <p>You could try one of these links:</p>
      <GameLinks />
    </div>
  )
}

function App() {
  return (
    <nav>
      <Switch>
        <Route key="home" exact path="/" component={HomePage} />
        {games.map(g =>
           <Route key={g.path} exact path={g.path} component={g.component} />,
        )}
        <Route key="404" path="/" component={PageNotFound} />
      </Switch>
    </nav>
  );
}

export default App;
