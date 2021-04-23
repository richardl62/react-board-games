import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

import { BoardAndPlayers } from "../boards";

interface GamePlayLocalProps {
  game: AppGame;
}

export function GamePlayLocal({ game }: GamePlayLocalProps) {
  const GameClient = Client({
    game: game,

    board: game.board,
    multiplayer: Local(),

    numPlayers: 1,
    debug: UrlParams.bgioDebugPanel,
  });

  return (<div> <GameClient /> </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  numPlayers: number;
  player: Player;
};

export function GamePlayOnline({ game, matchID, numPlayers, player }: GamePlayOnlineProps) {

  const GameClient = Client({
    game: game,
    board: (props: any) => (
        <BoardAndPlayers {...props} game={game}>
          {game.board}
        </BoardAndPlayers>
        ),
    multiplayer: SocketIO({ server: UrlParams.lobbyServer() }),

    numPlayers: numPlayers,
    debug: UrlParams.bgioDebugPanel,
  });

  return (
    <div>
      <GameClient matchID={matchID.mid} 
        playerID={player.id} credentials={player.credentials}
      />
    </div>
  );
}
