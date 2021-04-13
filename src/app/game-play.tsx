import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { AppGame } from "../app-game";
import { GameOptions, Player } from "./types";
import { lobbyServer } from "./url-options";

interface GamePlayLocalProps {
  game: AppGame;
  gameOptions: GameOptions;
}

export function GamePlayLocal({ game, gameOptions }: GamePlayLocalProps) {
  const GameClient = Client({
    game: game,

    board: game.renderGame,
    multiplayer: Local(),

    numPlayers: gameOptions.numPlayers,
    debug:  gameOptions.bgioDebugPanel,
  });

  return (<div>
    <GameClient />
  </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  gameOptions: GameOptions;

  matchID: string;
  player: Player;
}

export function GamePlayOnline({ game, matchID, gameOptions, player }: GamePlayOnlineProps) {

  const GameClient = Client({
    game: game,
    board: game.renderGame,
    multiplayer: SocketIO({ server: lobbyServer() }),

    numPlayers: gameOptions.numPlayers,
    debug:  gameOptions.bgioDebugPanel,
  });

  return (<div>
    <div>{`Match: ${matchID}  Player: ${player.id} (${player.credentials})`}</div>
    <GameClient matchID={matchID} playerID={player.id} credentials={player.credentials} />
  </div>);
}