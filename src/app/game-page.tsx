import React from 'react';
import { AppGame } from '../app-game';
import Lobby from './lobby';
import { SocketIO, Local } from 'boardgame.io/multiplayer'
import { Client } from 'boardgame.io/react';
import { Player, Servers } from './types';

interface GamePageProps {
  game: AppGame;

  matchID: string | null;
  setMatchID: (arg: string) => void;
  player: Player | null;
  setPlayer: (arg: Player) => void

  servers: Servers;
  online: boolean;
}

function LocalGame({ game } : GamePageProps) {
  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: Local(),
  });

  return (<div>
    <GameClient />
  </div>);
}

function OnlineGame({ game, matchID, player, servers } : GamePageProps) {

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
  const { matchID, player, online } = props;

  if(!online) {
    return <LocalGame {...props} />;
  } else if (matchID && player) {
    return <OnlineGame {...props} />;
  } else {
    return <Lobby {...props}/>
  }
}

export { GamePage };
