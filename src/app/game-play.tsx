import React, { useEffect } from 'react';
import { Client } from "boardgame.io/react";
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

interface GamePlayLocalProps {
  game: AppGame;
  numPlayers : number;
}

export function GamePlayLocal({ game, numPlayers}: GamePlayLocalProps) {
  useEffect(() => {
    document.title = game.displayName
  });

  const GameClient = Client({
    game: game,
    board: game.board,
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
    board: game.board,
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
