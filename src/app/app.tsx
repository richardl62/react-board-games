import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import games from '../games';
import { AppGame } from '../app-game'
import { GamePage } from './game-page';
import * as UrlParams from './url-params';

import styles from './app.module.css';

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
    <div className={nonNull(styles.gameLinks)}> 
      {games.map(gameLinkElement)}
    </div>
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
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
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

  const renderHomePage = () => <HomePage games={games} />;
  const renderPageNotFound = () => <PageNotFound games={games} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gameRoute)}
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
