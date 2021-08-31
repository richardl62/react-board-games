import React, { useEffect } from 'react';
import { Client, BoardProps as BgioBoardProps } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';
import { makeBoardProps } from '../shared/board-props';

// KUUDGE: Copy and paste - same code elsewhere
let lastCall = new Date();
function logTime(name: String) {
  const date = new Date();
  const ellapsed = (date.getTime() - lastCall.getTime()) / 1000;
  lastCall = date;

  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const now = `${hour}:${minutes}:${seconds}`;
  console.log(name, now, `(${ellapsed})`);
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
}
;

export function GamePlayOnline({ game, matchID, player }: GamePlayOnlineProps) {
  logTime('GamePlayOnline');

  useEffect(() => {
    document.title = game.displayName;
  });

  const server = UrlParams.lobbyServer();

  const GameClient = Client({
    game: game,
    board: (props: BgioBoardProps) => game.board(makeBoardProps(props)),
    multiplayer: SocketIO({ server: server }),

    //numPlayers: matchOptions.nPlayers, - is this needed for multi-player and if so why?
    debug: UrlParams.bgioDebugPanel,
  });

  return (
    <div>
      <GameClient matchID={matchID.mid}
        playerID={player.id} credentials={player.credentials} />
    </div>
  );

}
