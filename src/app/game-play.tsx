import { Client } from "boardgame.io/react";
import { Local } from 'boardgame.io/multiplayer';
import { AppGame } from "../app-game";
import { MatchID } from "./types";
import * as UrlParams from './url-params';

interface GamePlayLocalProps {
  game: AppGame;
}

export function GamePlayLocal({ game }: GamePlayLocalProps) {
  const GameClient = Client({
    game: game,

    board: game.renderGame,
    multiplayer: Local(),

    numPlayers: 1,
    debug: UrlParams.bgioDebugPanel,
  });

  return (<div> <GameClient /> </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
};
export function GamePlayOnline({ game, matchID }: GamePlayOnlineProps) {

  // const GameClient = Client({
  //   game: game,
  //   board: game.renderGame,
  //   multiplayer: SocketIO({ server: lobbyServer() }),

  //   numPlayers: 2,// KLUDGE
  // });

  return (<div>
        <div>{`Match: ${matchID.mid}`}</div>
    {/* <div>{`Match: ${matchID.mid}  Player: ${player.id} (${player.credentials})`}</div>
    <GameClient matchID={matchID.mid} playerID={player.id} credentials={player.credentials} /> */}
  </div>);
}
