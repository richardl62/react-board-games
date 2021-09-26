import React, { useEffect } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { games as appGames } from '../games';
import { AppGame } from '../shared/types';
import './app.css';
import { GamePage } from './game-page';
import * as UrlParams from './url-params';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gameLinkElement(game: AppGame, index: number): JSX.Element {
  const key = (n: number) => game.name + n;
  const to = {
    pathname: UrlParams.gamePath(game),
    search: window.location.search,
  }
  return <Link key={key(3)} to={to}>{game.displayName}</Link>
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

  const component = () => <GamePage game={game} matchID={UrlParams.matchID} offline={UrlParams.offline} />;

  return (<Route key={path} exact path={path} component={component} />);
}

/**
 * Games App.
 */
function App(): JSX.Element {
  useEffect(() => {
    document.title = 'Games'
  });

  const renderHomePage = () => <HomePage games={appGames} />;
  const renderPageNotFound = () => <PageNotFound games={appGames} />;
  return (
    <BrowserRouter>
      <Switch>
        <Route key="/" exact path="/" component={renderHomePage} />
        {appGames.map(gameRoute)}
        <Route key="pageNotFound" component={renderPageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
