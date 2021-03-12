import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import { gamePath } from '../url-tools';

import styles from './app.module.css';

import { Game, Servers } from "./types";
import { Lobby, GameLobby } from './lobby';
import { LegacyLobby, LobbyClient, GameClient} from './bgio-tools';
import { LobbyContext } from './lobby-context';
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
      {singleLink("/legacy-lobby", "Legacy lobby (temporary)")}
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

interface GamePageProps {
  game: Game;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
}

function GamePage({game, playersPerBrowser, bgioDebugPanel} : GamePageProps) {

  const Client = GameClient({
    game: game,
    numPlayers: 1,
    bgioDebugPanel: bgioDebugPanel,
    server: null,
  });

  let boards=[];
  for(let i = 0; i < playersPerBrowser; ++i) {
    boards.push(<Client key={i} playerID={i.toString()} />)
  }
  return (<div className={nonNull(styles.gamePage)}>
    {boards}
    <GameLobby game={game}/>
  </div>);
}

interface AppProps {
  games: Array<Game>;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
  servers: Servers;
  activeGameId: string | null;
}
function App(props : AppProps) {
  const {games, servers, activeGameId, } = props;
   
  const renderHomePage = ()=><HomePage games={games}/>;
  const renderPageNotFound = ()=><PageNotFound games={games}/>;
  return (
    <LobbyContext.Provider value={new LobbyClient(servers, activeGameId)}>
      <Switch>
        <Route key="/" exact path="/" component={renderHomePage} />
        {games.map(gd => {
          const path = gamePath(gd.name);
          const component = () => <GamePage game={gd} {...props} />;
          return (<Route key={path} exact path={path} component={component} />);
        })}

        <Route key="lobby" exact path="/lobby"
          component={() => <Lobby games={games} />}
        />

        <Route key="legacy-lobby" exact path="/legacy-lobby"
          component={() => <LegacyLobby games={games} servers={servers} />}
        />

        <Route key="pageNotFound" component={renderPageNotFound} />
      </Switch>
    </LobbyContext.Provider>
  );
}

export default App;
