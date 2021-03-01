import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import styles from './app.module.css';

import { makeGameRenderer, makeGameWithClient } from './game-renderer';
import { processLocation } from './url-tools';

import { Game } from './game'

import {Lobby} from '../bgio-tools';
const urlParams = processLocation(window.location);

function gamePath(game: Game) {
  const gamePage = game.name.replace(/[^\w]/g, ''); // Remove non-alphanumeric characters
  return `/${gamePage}`;
}

interface GameProps {
  games: Array<Game>;
} 

function GameLinks({games} : GameProps) {
  return (
    <ul>
      {games.map(gd => {
        const path = gamePath(gd);
        return (<li key={path}>
          <Link className={nonNull(styles.gameLink)} to={path}>{gd.name}</Link>
        </li>);
      }
      )}
    </ul>
  );
}

function HomePage(props : GameProps) {
  return (
    <div>
      <h2>Available games</h2>
      <GameLinks {...props}/>
      <br/>

      <Link className={nonNull(styles.gameLink)} to="/Lobby">Lobby</Link>
    </div>
  )
}

function PageNotFound(props : GameProps) {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <GameLinks {...props}/>
    </div>
  )
}

function NonLobbyGame({game} : {game: Game}) {
  const makeGameArgs = {
    game: game,
    nGames: urlParams.playerPerBrowser,
    numPlayers: 1,
    bgioDebugPanel: urlParams.bgioDebugPanel,
    server: null,
  };
  console.log("NonLobbyGame");
  const nonLobbyGame = makeGameWithClient(makeGameArgs);

  return (<>{nonLobbyGame}</>);
}


function App({games} : GameProps) {
  const lobbyGames = games.map(gd => {
    return {
        game: gd,
        component: makeGameRenderer(gd),
    };
  });

  const servers = {
    game: urlParams.server,
    lobby: urlParams.server,
  }

  const renderHomePage = ()=><HomePage games={games}/>;
  const renderPageNotFound = ()=><PageNotFound games={games}/>;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gd => {
        const path = gamePath(gd);
        const component = ()=><NonLobbyGame game={gd}/>;
        return (<Route key={path} exact path={path} component={component} />);
      })}

      <Route key="lobby" exact path="/lobby" 
          component={()=><Lobby servers={servers} games={lobbyGames}/>}
      />
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
