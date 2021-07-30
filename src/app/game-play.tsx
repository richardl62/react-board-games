import React, { useEffect } from 'react';
import { Client, BoardProps as BgioBoardProps} from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';
import { makeBoardProps } from '../shared/board-props';

interface GamePlayLocalProps {
  game: AppGame;
  numPlayers : number;
}

function localClientGame(game: AppGame, props: BgioBoardProps) {
  console.log("localClientGame", props);
  return game.board(makeBoardProps(props));
}

export function GamePlayLocal({ game, numPlayers}: GamePlayLocalProps) {
  useEffect(() => {
    document.title = game.displayName
  });

  const GameClient = Client({
    game: game,
    board: (props: BgioBoardProps) => localClientGame(game, props),
    multiplayer: Local(),
    numPlayers: numPlayers,
    debug: UrlParams.bgioDebugPanel,
  });

  const games = [];
  for(let id = 0; id < numPlayers; ++id) {
    games[id] = <GameClient key={id} playerID={id.toString()} />
  }
  return (<div> {games} </div>);
}

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
};

export function GamePlayOnline({ game, matchID, player }: GamePlayOnlineProps) {
  console.log("UrlParams", UrlParams);

  useEffect(() => {
    document.title = game.displayName
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
        playerID={player.id} credentials={player.credentials}
      />
    </div>
  );

}
