import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { AppGame } from '../shared/types'
import { appGames } from '../games';
import { GamePage } from './game-page';
import * as UrlParams from './url-params';
import styled from 'styled-components';

import './app.css';

const GameLinksStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 200%;
  margin-bottom: 0.5em;
`;

interface HomePageProps {
  games: Array<AppGame>;
}

function gameLinkElement(game: AppGame, index: number) {
  const key = (n: number) => game.name + n;
  const to={
    pathname: UrlParams.gamePath(game),
    search: window.location.search,
  }
  return  <Link key={key(3)} to={to}>{game.displayName}</Link>
}

function GameLinks({ games }: HomePageProps) {
  return (
    <GameLinksStyled> 
      {games.map(gameLinkElement)}
    </GameLinksStyled>
  )
}

function HomePage(props: HomePageProps) {
  return (
    <div>
      <h2>Available Games</h2>
      <GameLinks {...props} />
    </div>
  )
}

function PageNotFound(props: HomePageProps) {
  return (
    <div>
      <ErrorMessage>404: Page Not Found</ErrorMessage>
      <div>You could try one of these links:</div>
      <GameLinks {...props} />
    </div>
  )
}

function gameRoute(game: AppGame) {
  const path = UrlParams.gamePath(game);

  const component= () => <GamePage game={game} matchID={UrlParams.matchID}/>;

  return (<Route key={path} exact path={path} component={component} />); 
}


function App() {

  const renderHomePage = () => <HomePage games={appGames} />;
  const renderPageNotFound = () => <PageNotFound games={appGames} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {appGames.map(gameRoute)}
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
