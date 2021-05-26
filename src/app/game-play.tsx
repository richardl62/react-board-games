import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

interface GamePlayProps {
  game: AppGame;
  local?: boolean;
  numPlayers?: number;

  matchID?: MatchID;
  player?: Player;
};

export function GamePlay({ game, local, matchID, numPlayers, player }: GamePlayProps) {

  let multiplayer;
  if(!local) {
    const lobbyServer = UrlParams.lobbyServer();
    multiplayer = SocketIO({ server: lobbyServer}) 
  }

  let debugPanel = UrlParams.bgioDebugPanel;

  const GameClient = Client({
    game: game,
    board: game.board,
    multiplayer: multiplayer,

    numPlayers: numPlayers,
    debug: debugPanel,
  });

  return (
    <div>
      <GameClient 
      />
    </div>
  );
}
