import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import { gamePath } from '../url-tools';

import styles from './app.module.css';

import { Game, Servers } from "./types";
import LegacyLobby from './legacy-lobby';
import { GamePage } from './game-page';
import { Options } from '../url-tools';


interface HomePageProps {
  games: Array<Game>;
} 

function AvailableLinks({games} : HomePageProps) {
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
      {singleLink("/lobby", "Lobby (to aid with testing)")}
    </ul>
  );
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
  games: Array<Game>;
  options: Options;
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
        const path = gamePath(gd.name);
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
