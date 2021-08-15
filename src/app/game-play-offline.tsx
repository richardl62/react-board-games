import React, { useEffect, useState } from 'react';
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local } from 'boardgame.io/multiplayer';
import { AppGame } from "../shared/types";
import * as UrlParams from './url-params';
import { makeBoardProps } from '../shared/board-props';
import { TestDebugBox } from '../shared/test-debug-box';

interface GamePlayLocalProps {
  game: AppGame;
  numPlayers : number;
}

function localClientGame(game: AppGame, props: BgioBoardProps) {
  return game.board(makeBoardProps(props));
}

export function GamePlayOffline({ game, numPlayers}: GamePlayLocalProps) {
  useEffect(() => {
    document.title = game.displayName
  });
  const [persist, setPersist] = useState(false);

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
    <div>
      <div>{games}</div> 
      <TestDebugBox> 
        <span>{'Peristant storage (experimental): '}</span>
        <button onClick={() => setPersist(!persist)}>{`Turn ${persist ? 'off' : 'on'}`}</button>
      </TestDebugBox>
    </div>
  );
}


