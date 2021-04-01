import { AppGame } from '../app-game';

export interface Servers {
  game: string;
  lobby: string;
}

export interface Player {
  id: string;
  credentials: string;
}

export interface JoinedMatch {
  game: AppGame;
  matchID: string;
  playerID: string;
  playerCredentials: string;
}

export const numPlayers = 1;

export type { AppGame } from '../app-game';
// Exports are done inline