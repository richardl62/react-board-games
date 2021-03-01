import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { nonNull } from '../tools';
import styles from './app.module.css';

import { makeGameRenderer, makeGameWithClient } from './game-renderer';
import { processLocation } from './url-tools';


import {Lobby} from '../bgio-tools';

import gameDefinitionsXXX  from '../games'
type GameDefinition = (typeof gameDefinitionsXXX)[number];
const urlParams = processLocation(window.location);

function gamePath(gameDefinition: GameDefinition) {
  const gamePage = gameDefinition.name.replace(/[^\w]/g, ''); // Remove non-alphanumeric characters
  return `/${gamePage}`;
}

interface GameDefinitionProps {
  gameDefinitions: Array<GameDefinition>;
} 

function GameLinks({gameDefinitions} : GameDefinitionProps) {
  return (
    <ul>
      {gameDefinitions.map(gd => {
        const path = gamePath(gd);
        return (<li key={path}>
          <Link className={nonNull(styles.gameLink)} to={path}>{gd.name}</Link>
        </li>);
      }
      )}
    </ul>
  );
}

function HomePage(props : GameDefinitionProps) {
  return (
    <div>
      <h2>Available games</h2>
      <GameLinks {...props}/>
      <br/>

      <Link className={nonNull(styles.gameLink)} to="/Lobby">Lobby</Link>
    </div>
  )
}

function PageNotFound(props : GameDefinitionProps) {
  return (
    <div className={nonNull(styles.pageNotFound)}>
      <div>404: Page Not Found</div>
      <div>You could try one of these links:</div>
      <GameLinks {...props}/>
    </div>
  )
}

function NonLobbyGame({gameDefinition} : {gameDefinition: GameDefinition}) {
  const games = makeGameWithClient({
    gameDefinition: gameDefinition,
    nGames: urlParams.playerPerBrowser,
    bgioDebugPanel: urlParams.bgioDebugPanel,
  });

  return (<>{games}</>);
}


function App({gameDefinitions} : GameDefinitionProps) {
  const lobbyGames = gameDefinitions.map(gd => {
    return {
        gameDefinition: gd,
        component: makeGameRenderer(gd),
    };
  });

  const servers = {
    game: urlParams.server,
    lobby: urlParams.server,
  }

  const renderHomePage = ()=><HomePage gameDefinitions={gameDefinitions}/>;
  const renderPageNotFound = ()=><PageNotFound gameDefinitions={gameDefinitions}/>;
  return (
    <Switch>
      <Route key="/" exact path="/" component={renderHomePage} />
      {gameDefinitions.map(gd => {
        const path = gamePath(gd);
        const component = ()=><NonLobbyGame gameDefinition={gd}/>;
        return (<Route key={path} exact path={path} component={component} />);
      })}

      <Route key="lobby" exact path="/lobby" 
          component={()=><Lobby servers={servers} games={lobbyGames}/>}
      />
      <Route key="pageNotFound" component={renderPageNotFound} />
    </Switch>
  );
}

export default App;
