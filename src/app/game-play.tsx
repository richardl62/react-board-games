import React from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';

interface LocalProps {
  game: AppGame;
  numPlayers: number;
};

export function Local({ game, numPlayers }: LocalProps) {
  const GameClient = Client({
    game: game,
    board: game.board,
    debug: UrlParams.bgioDebugPanel,
  });
  console.log("numPlayers=", numPlayers);

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
  console.log("UrlParams", UrlParams);

  const server = UrlParams.lobbyServer();

  const GameClient = Client({
    game: game,
    board: game.board,
    multiplayer: SocketIO({ server: server}),

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
