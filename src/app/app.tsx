import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import styles from './app.module.css';

import { makeGameWithClient } from './game-renderer';
import { processLocation } from './url-tools';

import { Game } from './game'

import {Lobby, LobbyOldStyle} from './bgio-tools';
const urlParams = processLocation(window.location);

function gamePath(game: Game) {
  return `/${game.name}`;
}

interface GameProps {
  games: Array<Game>;
} 

function GameLinks({games} : GameProps) {
  return (
    <ul>
      {games.map(gd => {
        const path = gamePath(gd);
        return (
        <li key={path}>
          <Link className={nonNull(styles.gameLink)} to={path}>{gd.displayName}</Link>
        </li>);
      }
      )}
      
      <li key={'lobby'}>
        <Link className={nonNull(styles.gameLink)} to="/lobby">Lobby</Link>
      </li>

      <li key={'lobby-old-style'}>
        <Link className={nonNull(styles.gameLink)} to="/lobby-old-style">Lobby (old style)</Link>
      </li>
    </ul>
  );
}

function HomePage(props : GameProps) {
  return (
    <div>
      <GameLinks {...props}/>
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
  // const lobbyGames = games.map(gd => {
  //   return {
  //       game: gd,
  //       component: makeGameRenderer(gd),
  //   };
  // });

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
          component={()=><Lobby servers={servers} games={games}/>}
      />

      <Route key="lobby-old-style" exact path="/lobby-old-style" 
          component={()=><LobbyOldStyle servers={servers} games={games}/>}
      />

      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
