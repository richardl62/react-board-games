import React from 'react';
import { Player, Servers, Game } from './types'
import Lobby from './lobby';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { Options, matchPath } from './url-tools';
interface GamePageProps {
  options: Options;
  game: Game;
  servers: Servers;
}

function GamePage({ game, servers, options } : GamePageProps) {
  const {matchID, player} = options;
  const callback = (matchID: string, player?:Player) => {
    window.location.href = matchPath(game.name, matchID, player);
  }

  if (!(matchID && player)) {
    return <Lobby 
      server={servers.lobby}
      game={game} 
      matchID={matchID}
      player={player}
      callback={callback}
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
