import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import games from '../games';

import styles from './app.module.css';

import { AppGame } from '../app-game'
import { GamePage } from './game-page';

type GameStatus = {online: boolean};
function gameURL(game: AppGame, {online}: GameStatus) {
  let base =`/${game.name}`;
  if(online) {
    base += '/lobby';
  }
  return base;
}

interface HomePageProps {
  games: Array<AppGame>;
}

function gameLinkElements(game: AppGame, index: number) {
  const key = (n: number) => game.name + n;
  return [
      <span key={key(1)}>{game.displayName}</span>,
      <Link key={key(2)} to={gameURL(game, {online:false})}>Local</Link>,
      <Link key={key(3)} to={gameURL(game, {online:true})}>Online</Link>
  ];
}

function GameLinks({ games }: HomePageProps) {
  return (
    <div className={nonNull(styles.gameLinks)}> 
      {games.map(gameLinkElements)}
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

function gameRoute(game: AppGame, status : GameStatus) {
  const path = gameURL(game, status);

  const component= () => <GamePage game={game} online={status.online}/>;

  return (<Route key={path} exact path={path} component={component} />); 
}

function gameRoutes(game: AppGame) {
  return [ gameRoute(game, {online:true}), gameRoute(game, {online:false})];
}


function App() {

  const renderHomePage = () => <HomePage games={games} />;
  const renderPageNotFound = () => <PageNotFound games={games} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gameRoutes)}
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
