import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { AppGame } from "../app-game";
import { Player, Servers } from "./types";

interface GamePlayLocalProps {
  game: AppGame;
  numPlayers: number;
}

export function GamePlayLocal({ game, numPlayers }: GamePlayLocalProps) {
  const GameClient = Client({
    game: game,
    numPlayers: numPlayers,
    board: game.renderGame,
    multiplayer: Local(),
  });

  return (<div>
    <GameClient />
  </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  numPlayers: number;

  matchID: string;
  player: Player;
  servers: Servers;
}

export function GamePlayOnline({ game, matchID, numPlayers, player, servers }: GamePlayOnlineProps) {

  const GameClient = Client({
    game: game,
    numPlayers: numPlayers,
    board: game.renderGame,
    multiplayer: SocketIO({ server: servers.lobby }),
  });

  return (<div>
    <div>{`Match: ${matchID}  Player: ${player.id} (${player.credentials})`}</div>
    <GameClient matchID={matchID} playerID={player.id} credentials={player.credentials} />
  </div>);
}