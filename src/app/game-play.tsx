import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

interface LocalProps {
  game: AppGame;
};

export function Local({ game }: LocalProps) {
  const GameClient = Client({
    game: game,
    board: game.board,
  });

  return (
    <div>
      <GameClient />
    </div>
  );
}

interface MultiPlayerProps {
  game: AppGame;
  matchID: MatchID;
  numPlayers: number;
  player: Player;
};

export function MultiPlayer({ game, matchID, numPlayers, player }: MultiPlayerProps) {
  const lobbyServer = UrlParams.lobbyServer();
  let debugPanel = UrlParams.bgioDebugPanel;

  const GameClient = Client({
    game: game,
    board: game.board,
    multiplayer: SocketIO({ server: lobbyServer}),

    numPlayers: numPlayers,
    debug: debugPanel,
  });

  return (
    <div>
      <GameClient matchID={matchID.mid} 
        playerID={player.id} credentials={player.credentials}
      />
    </div>
  );
}
