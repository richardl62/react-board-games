import { AppGame } from '../app-game';

export interface Player {
  id: string;
  credentials: string;
}

export interface GameOptions {
  numPlayers: number;
  bgioDebugPanel: boolean;
}

export interface MatchID {
  mid: string
} 

export interface JoinedMatch {

  game: AppGame;
  matchID: string;
  playerID: string;
  playerCredentials: string;
}

export type { AppGame } from '../app-game';