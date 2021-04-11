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

export const LocalMatch = 'local match';

export interface AppOptions {
  playersPerBrowser: number;
  bgioDebugPanel: boolean;
  matchID: string | typeof LocalMatch | null;
  player: Player | null;
}

export type SetAppOptions = (options: Partial<AppOptions>) => void;

export type { AppGame } from '../app-game';
// Exports are done inline