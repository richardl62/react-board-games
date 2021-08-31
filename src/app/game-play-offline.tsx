import React, { useEffect } from 'react';
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local } from 'boardgame.io/multiplayer';
import { AppGame } from "../shared/types";
import * as UrlParams from './url-params';
import { makeBoardProps } from '../shared/board-props';

interface GamePlayLocalProps {
  game: AppGame;
  nPlayers : number;
  persist: boolean;
}

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

function localClientGame(game: AppGame, props: BgioBoardProps) {
  logTime('localClientGame');
  return game.board(makeBoardProps(props));
}

export function GamePlayOffline({ game, nPlayers: numPlayers, persist}: GamePlayLocalProps) {

  useEffect(() => {
    document.title = game.displayName
  });


  const GameClient = Client({
    game: game,
    board: (props: BgioBoardProps) => localClientGame(game, props),
    multiplayer: Local({persist:persist}),
    numPlayers: numPlayers,
    debug: UrlParams.bgioDebugPanel,
  });

  const games = [];
  for(let id = 0; id < numPlayers; ++id) {
    games[id] = <GameClient key={id} playerID={id.toString()} />
  }
  return (
      <div>{games}</div> 
  );
}


