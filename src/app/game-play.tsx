import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

interface GamePlayProps {
  game: AppGame;
  matchID: MatchID;
  numPlayers: number;
  player: Player;
};

export function GamePlay({ game, matchID, numPlayers, player }: GamePlayProps) {

  const GameClient = Client({
    game: game,
    board: game.board,
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
