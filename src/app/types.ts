import { AppGame } from '../app-game';

export interface Servers {
  game: string;
  lobby: string;
}

export interface Player {
  id: string;
  credentials: string;
}

export type Match = {local?: true, id?: string} // local and id should not both be set. 

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