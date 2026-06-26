import { SetupArg0, SetupResult } from '../../game-control.js';

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

export function startingServerData(
  { ctx }: SetupArg0,
  options: SetupOptions,
): SetupResult {
  const state: ServerData = {
    sharedCount: options.startingValue,
    lastSnap: 0,
  };
  const playerData: Record<string, PlayerGameData> = {};
  for (const id of ctx.playOrder) {
    playerData[id] = { count: 0 };
  }
  return { state, playerData };
}
