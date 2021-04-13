import { AppGame } from '../app-game';

export interface Player {
  id: string;
  credentials: string;
}

export interface GameOptions {
  numPlayers: number;
  bgioDebugPanel: boolean;
}

export interface Match {
  // local and id should not both be set. 
  local?: true, 
  id?: string
} 

export interface JoinedMatch {

  game: AppGame;
  matchID: string;
  playerID: string;
  playerCredentials: string;
}

export interface AppOptions {
  playersPerBrowser: number;
  bgioDebugPanel: boolean;

  match: Match;
  player: Player | null;
}

export type { AppGame } from '../app-game';