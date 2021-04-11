import React from 'react';
import { AppGame } from '../app-game';
import Lobby from './lobby';
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { AppOptions, Servers, SetAppOptions } from './types';

interface GamePageProps {
  game: AppGame;

  appOptions: AppOptions;
  setAppOptions: SetAppOptions;

  servers: Servers;
}

function PlayLocal({ game } : GamePageProps) {
  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: Local(),
  });

  return (<div>
    <GameClient />
  </div>);
}

function PlayOnline({ game, appOptions, servers } : GamePageProps) {
  const {player, matchID} = appOptions;
  if(!player || !matchID) {
    throw new Error("player and match are not both defined");
  }

  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: SocketIO({server: servers.lobby}),
  });
  
    return (<div>
      <div>{`Match: ${matchID}  Player: ${player.id} (${player.credentials})`}</div>
      <GameClient matchID={matchID} playerID={player.id} credentials={player.credentials} />
    </div>);
}


function GamePage(props: GamePageProps) {
  const { playStatus } = props.appOptions;

  if (playStatus === 'local') {
    return <PlayLocal {...props} />;
  } else if (playStatus === 'online') {
    return <PlayOnline  {...props}/>
  } else {
    return <Lobby {...props}/>
  }
}

export { GamePage };
