import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import { gamePath } from '../url-tools';

import styles from './app.module.css';

import { makeGameWithClient } from './game-renderer';

import { Game } from './game'
import {Lobby, GameLobby } from './lobby';
import {LobbyOldStyle} from './bgio-tools';
import { Options, OptionsContext, useOptionsContext } from './options';

interface GameProps {
  games: Array<Game>;
} 


function AvailableLinks({games} : GameProps) {
  function singleLink(path: string, displayName: string) {
    return (
      <li key={path}>
        <Link className={nonNull(styles.gameLink)} to={path}>{displayName}</Link>
      </li>
    );
  }
  return (
    <ul>
      {games.map(gd => singleLink(gamePath(gd.name), gd.displayName))}

      <br/>
      {singleLink("/lobby", "Lobby (For online play)")}
      {singleLink("/lobby-old-style", "Old Style lobby")}
    </ul>
  );
}

function HomePage(props : GameProps) {
  return (
    <div>
      <h2>Available links</h2>
      <AvailableLinks {...props}/>
    </div>
  )
}

function PageNotFound(props : GameProps) {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <AvailableLinks {...props}/>
    </div>
  )
}

interface NonLobbyGameProps {
  game: Game;
}
function GamePage({game} : NonLobbyGameProps) {

  const options = useOptionsContext();
  const makeGameArgs = {
    game: game,
    nGames: options.playersPerBrowser,
    numPlayers: 1,
    bgioDebugPanel: options.bgioDebugPanel,
    server: null,
  };

  return (<div className={nonNull(styles.gamePage)}>
    {makeGameWithClient(makeGameArgs)}
    <GameLobby game={game}/>
  </div>);
}

interface AppProps {
  games: Array<Game>;
  options: Options;
}
function App({games, options} : AppProps) {
   
  const renderHomePage = ()=><HomePage games={games}/>;
  const renderPageNotFound = ()=><PageNotFound games={games}/>;
  return (
    <OptionsContext.Provider value={options}>
      <Switch>
        <Route key="/" exact path="/" component={renderHomePage} />
        {games.map(gd => {
          const path = gamePath(gd.name);
          const component = () => <GamePage game={gd} />;
          return (<Route key={path} exact path={path} component={component} />);
        })}

        <Route key="lobby" exact path="/lobby"
          component={() => <Lobby games={games} />}
        />

        <Route key="lobby-old-style" exact path="/lobby-old-style"
          component={() => <LobbyOldStyle games={games} />}
        />

        <Route key="pageNotFound" component={renderPageNotFound} />
      </Switch>
    </OptionsContext.Provider>
  );
}

export default App;
