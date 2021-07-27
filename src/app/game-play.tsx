import React, { useEffect } from 'react';
import { Client } from "boardgame.io/react";
import { SocketIO } from 'boardgame.io/multiplayer';
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from './url-params';
import { MatchOptions } from './start-match-options';
import assert from '../shared/assert';

interface GamePlayProps {
  game: AppGame;
  matchID: MatchID;
  matchOptions: MatchOptions;
  player: Player | null;
};

export function GamePlay({ game, matchID, matchOptions, player }: GamePlayProps) {
  console.log("UrlParams", UrlParams);

  useEffect(() => {
    document.title = game.displayName
  });


  if(matchOptions.local) {
    return <div>Local Game - more work needed</div>
  } else {
    assert(player);
    const server = UrlParams.lobbyServer();

    const GameClient = Client({
      game: game,
      board: game.board,
      multiplayer: SocketIO({ server: server }),

      numPlayers: matchOptions.nPlayers,
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
}
