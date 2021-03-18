import React from 'react';
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

  const matchID = lobbyClient.activeMatch || undefined;
  console.log("GamePage: matchID=", matchID);
  let boards = [];
  for (let i = 0; i < playersPerBrowser; ++i) {
    boards.push(<Client key={i} matchID={matchID} />);
  }
  return (
    <div className={nonNull(styles.gamePage)}>
      {boards}

      <GameLobby game={game} />
    </div>
  );
}
