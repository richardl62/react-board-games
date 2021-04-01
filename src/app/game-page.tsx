import React from 'react';
import { AppGame } from '../app-game';
import { Servers } from './types'
import Lobby from './lobby';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { AppOptions } from './app-options';
interface GamePageProps {
  options: AppOptions;
  game: AppGame;
  servers: Servers;
}

function GamePage({ game, servers, options } : GamePageProps) {
  const {matchID, player} = options;

  if (!(matchID && player)) {
    return <Lobby 
      server={servers.lobby}
      game={game} 
      options={options}
    />
  }

  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: SocketIO({ server: servers.lobby }),
  });

  return (<div>
    <div>{`Match: ${matchID}  Player: ${player.id} (${player.credentials})`}</div>
    <GameClient matchID={matchID} playerID={player.id} credentials={player.credentials} />
  </div>);

}

export { GamePage };
