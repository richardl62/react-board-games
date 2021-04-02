import React from 'react';
import { AppGame } from '../app-game';
import { Servers } from './types'
import Lobby from './lobby';
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { AppOptions } from './app-options';
interface GamePageProps {
  options: AppOptions;
  game: AppGame;
  servers: Servers;
  online?: boolean;
}

function LocalGame({ game, options } : GamePageProps) {
  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: Local(),
  });

  return (<div>
    <GameClient />
  </div>);
}

function OnlineGame({ game, servers, options } : GamePageProps) {
  const {matchID, player} = options;
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
  const { options, online } = props;
  console.log("GamePage", options);

  if(!online) {
    return <LocalGame {...props} />;
  } else if (options.matchID && options.player) {
    return <OnlineGame {...props} />;
  } else {
    return <Lobby {...props} />
  }
}

export { GamePage };
