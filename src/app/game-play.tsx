import { nonNull } from '../tools';
import { Game } from "./types";
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import styles from './app.module.css';

interface GamePlayProps {
  game: Game;
  bgioDebugPanel: boolean;
  matchID: string;
  playerID: number;
  server: string;
}
export function GamePlay({ game, bgioDebugPanel, playerID, matchID, server }: GamePlayProps) {
  console.log('Connecting to server:', server);

  const multiplayer = server ? SocketIO({ server: server }) : Local();

  const numPlayers = 1; //KLUDGE
  const GameClient = Client({
      multiplayer: multiplayer,
      game: game,
      board: game.renderGame,
      debug: bgioDebugPanel,
      numPlayers: numPlayers,

  });
 
  return (
    <div className={nonNull(styles.gamePage)}>
      <GameClient
        matchID={matchID}
        playerID={playerID.toString()}
        credentials={"xxx"}
      />
    </div>
  );
}
export interface GamePageProps {
  game: Game;
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
}
