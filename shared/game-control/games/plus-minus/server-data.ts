import { SetupArg0 } from '../../game-control.js';

export interface SetupOptions {
  readonly startingValue: number;
}

export interface ServerData {
  sharedCount: number;

  // When all players' counts (stored in PublicPlayerMetadata.gameData) are equal,
  // lastSnap is set to that value and all counts are reset to 0.
  lastSnap: number;
}

export interface PlayerGameData {
  count: number;
}

export function startingServerData(_arg0: SetupArg0, options: SetupOptions): ServerData {
  return {
    sharedCount: options.startingValue,
    lastSnap: 0,
  };
}
