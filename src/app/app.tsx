import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import games from '../games';

import styles from './app.module.css';

import { AppGame } from '../app-game'
import { GamePage } from './game-page';

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

  const renderHomePage = () => <HomePage games={games} />;
  const renderPageNotFound = () => <PageNotFound games={games} />;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {games.map(gd => {
        const path = gameURL(gd);
        const component = () => (
          <GamePage game={gd} />
        );
        return (<Route key={path} exact path={path} component={component}/>
        );
      })}
      
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
