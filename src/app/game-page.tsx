import React from 'react';
import { Lobby, Player } from './lobby';
import { SocketIO } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { PlayerAndMatchID } from './url-tools';
import { Servers, Game } from './types'
import game from '../games/simple-game'

interface GamePageProps {
  bgioDebugPanel: boolean;
  game: Game;
  servers: Servers;
}

function GamePage({ servers } : GamePageProps) {
  const playerAndMatchID = new PlayerAndMatchID(window.location);
  const {matchID, player} = playerAndMatchID;
  const callback = (matchID: string, player?:Player) => {
    playerAndMatchID.set(matchID, player);
    window.location.href = playerAndMatchID.href();
  }

  if (!(matchID && player)) {
    return <Lobby 
      server={servers.lobby}
      game={game} 
      matchID={playerAndMatchID.matchID}
      player={playerAndMatchID.player}
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
