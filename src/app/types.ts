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

  playStatus: 'local' | 'online' | null; // non-null when ready to play.
  matchID: string | null;
  player: Player | null;
}

export type SetAppOptions = (options: Partial<AppOptions>) => void;

export type { AppGame } from '../app-game';
// Exports are done inline