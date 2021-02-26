import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import styles from './app.module.css';

import { makeGameRenderer, makeGamesWithClient } from './game-renderer';
import { processLocation } from './url-tools';

import gameDefinitions  from '../games';
import {Lobby} from '../bgio-tools';

type GameDefinition = (typeof gameDefinitions)[number];

const urlParams = processLocation(window.location);

function gamePath(gameDefinition: GameDefinition) {
  const gamePage = gameDefinition.name.replace(/[^\w]/g, ''); // Remove non-alphanumeric characters
  return `/${gamePage}`;
}


function GameLinks() {
  return (
    <ul>
      {gameDefinitions.map(gd => {
        const path = gamePath(gd);
        return (<li key={path}>
          <Link className={nonNull(styles.gameLink)} to={path}>{gd.name}</Link>
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

      <Link className={nonNull(styles.gameLink)} to="/Lobby">Lobby</Link>
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

function NonLobbyGame({gameDefinition} : {gameDefinition: GameDefinition}) {
  const games = makeGamesWithClient({
    gameDefinition: gameDefinition,
    nGames: urlParams.playerPerBrowser,
    bgioDebugPanel: urlParams.bgioDebugPanel,
  });

  return (<>{games}</>);
}

function App() {

  const lobbyGames = gameDefinitions.map(gd => {
    return {
        gameDefinition: gd,
        component: makeGameRenderer(gd),
    };
  });

  const servers = {
    game: urlParams.server,
    lobby: urlParams.server,
  }
  return (
    <Switch>
      <Route key="/" exact path="/" component={HomePage} />
      {gameDefinitions.map(gd => {
        const path = gamePath(gd);
        const component = ()=><NonLobbyGame gameDefinition={gd}/>;
        return (<Route key={path} exact path={path} component={component} />);
      })}

      <Route key="lobby" exact path="/lobby" 
          component={()=><Lobby servers={servers} games={lobbyGames}/>}
      />
      <Route key="pageNotFound" component={PageNotFound} />
    </Switch>
  );
}

export default App;