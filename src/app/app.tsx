import { useState } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import games from '../games';

import styles from './app.module.css';

import { AppGame } from '../app-game'
import LegacyLobby from './legacy-lobby';
import { GamePage } from './game-page';
import { AppOptions, SetAppOptions } from './types';
import { getURLOptions } from './url-options';

const appOptionsDefault : AppOptions = {
  playersPerBrowser: 1,
  bgioDebugPanel: false,
  playStatus: null,
  matchID: null,
  player: null,
};

const servers = { // KLUDGE
  game: 'http://localhost:3000',
  lobby: 'http://localhost:8000',
}

function gameURL(game: AppGame) {
  return `/${game.name}`;
}

interface HomePageProps {
  games: Array<AppGame>;
}

function gameLink(game: AppGame, index: number) {
  return (
    <Link key={game.displayName} to={gameURL(game)}>{game.displayName}</Link>
  );
}

function AvailableLinks({ games }: HomePageProps) {
  return (
    <div className={nonNull(styles.gameLinks)}>
      {games.map(gameLink)}
    </div>
  )
}

function HomePage(props: HomePageProps) {
  return (
    <div>
      <h2>Available links</h2>
      <AvailableLinks {...props} />
    </div>
  )
}

function PageNotFound(props: HomePageProps) {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <AvailableLinks {...props} />
    </div>
  )
}

function App() {
  const initialAppOptions = {...appOptionsDefault, ...getURLOptions()};
  const [appState, setAppState] = useState<AppOptions>(initialAppOptions);

  const setAppOptions: SetAppOptions = (options: Partial<AppOptions>) => {
    let newState = {...appState, ...options};
    if(newState.player && newState.matchID) {
      newState.playStatus = 'online';
    }
    setAppState(newState);
  } 

  const renderHomePage = () => <HomePage games={games} />;
  const renderPageNotFound = () => <PageNotFound games={games} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gd => {
        const path = gameURL(gd);
        const component = () => (
          <GamePage
            game={gd}
            appOptions={appState}
            setAppOptions={setAppOptions}
            servers={servers}
          />
        );
        return (<Route key={path} exact path={path} component={component}/>
        );
      })}

      <Route key="lobby" exact path="/lobby"
        component={() => <LegacyLobby games={games} servers={servers} />}
      />

      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
