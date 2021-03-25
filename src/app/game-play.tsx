import { nonNull } from '../tools';
import { JoinedMatch, numPlayers } from "./types";
import { Client } from 'boardgame.io/react';
import { SocketIO, Local } from 'boardgame.io/multiplayer';
import styles from './app.module.css';

interface GamePlayProps {
  joinedMatch: JoinedMatch ;
  bgioDebugPanel: boolean;
  server: string;
}
export function GamePlay({ joinedMatch, bgioDebugPanel, server }: GamePlayProps) {
  const {game, playerID, playerCredentials, matchID} = joinedMatch;
  console.log('Connecting', playerID, '-', playerCredentials,
   'to match', matchID, " on ", server);

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
        playerID={playerID}
        credentials={playerCredentials}
      />
    </div>
  );
}

