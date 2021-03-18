import React, { useState } from 'react';
import { nonNull } from '../tools';
import styles from './app.module.css';
import { Game } from "./types";
import { GameLobby } from './game-lobby';
import { useLobbyClient } from './lobby-client';
import { GameClient } from './game-client';

interface GamePageProps {
  game: Game;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
}
export function GamePage({ game, playersPerBrowser, bgioDebugPanel }: GamePageProps) {
  const lobbyClient = useLobbyClient();
  const Client = GameClient({
    game: game,
    numPlayers: 1,
    bgioDebugPanel: bgioDebugPanel,
    server: null,
  });

  const [playerID, setPlayerID] = useState<string|null>(null);

  const matchID = lobbyClient.activeMatch || undefined;
  console.log("GamePage: matchID=", matchID);
  return (
    <div className={nonNull(styles.gamePage)}>
      {playerID && <Client matchID={matchID} playerID={playerID}/>}

      <GameLobby game={game} setPlayerID={setPlayerID}/>
    </div>
  );
}
