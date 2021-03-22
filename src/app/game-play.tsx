import { nonNull } from '../tools';
import { Game, numPlayers } from "./types";
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import styles from './app.module.css';

export interface Player {
  id: string, 
  credentials: string
};

interface GamePlayProps {
  game: Game;
  bgioDebugPanel: boolean;
  matchID: string;
  player: Player;
  server: string;
}
export function GamePlay({ game, bgioDebugPanel, player, matchID, server }: GamePlayProps) {
  console.log('Connecting', player, 'to', server);

  const multiplayer = server ? SocketIO({ server: server }) : Local();
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
        playerID={player.id}
        credentials={player.credentials}
      />
    </div>
  );
}

