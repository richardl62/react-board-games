import { useState } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import games from '../games';

import styles from './app.module.css';

import { AppGame } from '../app-game'
import LegacyLobby from './legacy-lobby';
import { GamePage } from './game-page';
import { appOptionsDefault, Player } from './types';
import { getURLOptions, setMatchID } from './url-options';

const servers = { // KLUDGE
  game: 'http://localhost:3000',
  lobby: 'http://localhost:8000',
}

function gameURL(game: AppGame) {
  return `/${game.name}`;
}

function onlineGameURL(game: AppGame) {
  return gameURL(game) + '/online';
}

interface HomePageProps {
  games: Array<AppGame>;
}

function gameLinks(game: AppGame, index: number) {
  return [
    <div key={index * 3}>{game.displayName}</div>,
    <Link key={index * 3 + 1} to={gameURL(game)}>local</Link>,
    <Link key={index * 3 + 2} to={onlineGameURL(game)}>online</Link>,
  ]
}

function AvailableLinks({ games }: HomePageProps) {
  return (
    <div className={nonNull(styles.gameLinks)}>
      {games.map(gameLinks)}
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
  const [player, setPlayer] = useState<Player|null>(null);

  const urlParams = {...appOptionsDefault, ...getURLOptions()};

  const sharedAppOptions = {
    player: player,
    setPlayer: setPlayer,
    matchID: urlParams.matchID,
    setMatchID: setMatchID,

    servers: servers,
  }
  const renderHomePage = () => <HomePage games={games} />;
  const renderPageNotFound = () => <PageNotFound games={games} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gd => {
        const path = gameURL(gd);
        const component = () => (
          <GamePage game={gd} {...sharedAppOptions} online={false} />
        );
        const onlineComponent = () => (
          <GamePage game={gd} {...sharedAppOptions} online={true} />
        );

        const onlinePath = onlineGameURL(gd);
        return ([
          <Route key={path} exact path={path} component={component} />,
          <Route key={onlinePath} exact path={onlinePath} component={onlineComponent} />
        ]);
      })}

      <Route key="lobby" exact path="/lobby"
        component={() => <LegacyLobby games={games} servers={servers} />}
      />

      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
