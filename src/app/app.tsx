import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';

import styles from './app.module.css';

import { AppGame } from '../app-game'
import { Servers } from "./types";
import LegacyLobby from './legacy-lobby';
import { GamePage } from './game-page';
import AppOptions from './app-options';

function gameURL(game: AppGame) {
  return `/${game.name}`;
}

function onlineGameURL(game: AppGame) {
  return gameURL(game) + '?online';
}

interface HomePageProps {
  games: Array<AppGame>;
} 

function gameLinks(game: AppGame, index:number) {
  return [
      <div key={index*3}>{game.displayName}</div>,
      <Link key={index*3+1} to={gameURL(game)}>local</Link>,
      <Link key={index*3+2} to={onlineGameURL(game)}>online</Link>,
  ]
}

function AvailableLinks({games} : HomePageProps) {
  return (
    <div className={nonNull(styles.gameLinks)}>
      {games.map(gameLinks)}
    </div>
  )
}

function HomePage(props : HomePageProps) {
  return (
    <div>
      <h2>Available links</h2>
      <AvailableLinks {...props}/>
    </div>
  )
}

function PageNotFound(props : HomePageProps) {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <AvailableLinks {...props}/>
    </div>
  )
}

interface AppProps {
  games: Array<AppGame>;
  options: AppOptions;
  servers: Servers;
}
function App(props : AppProps) {
  const {games, servers } = props;
   
  const renderHomePage = ()=><HomePage games={games}/>;
  const renderPageNotFound = ()=><PageNotFound games={games}/>;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gd => {
        const path = gameURL(gd);
        const component = () => (
             <GamePage game={gd} {...props} />
        );

        return (<Route key={path} exact path={path} component={component} />);
      })}

      <Route key="lobby" exact path="/lobby"
        component={() => <LegacyLobby games={games} servers={servers} />}
      />

      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
