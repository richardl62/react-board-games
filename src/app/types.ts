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

export interface AppOptions {
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
  online: boolean;
  matchID: string | null;
  player: Player | null;
}

export const appOptionsDefault : AppOptions = {
  playersPerBrowser: 1,
  bgioDebugPanel: false,
  online: false,
  matchID: null,
  player: null,
};

export type SetAppOptions = (options: Partial<AppOptions>) => void;

export type { AppGame } from '../app-game';
// Exports are done inline