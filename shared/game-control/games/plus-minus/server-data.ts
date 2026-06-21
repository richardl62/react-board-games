import { SetupArg0 } from '../../game-control.js';

export interface SetupOptions {
  readonly startingValue: number;
}

export interface ServerData {
  sharedCount: number;

  playerCount: Record<string, number>;

  // When all player counts are equal, snapCount is set to that
  // value and the play counts are then reset to 0
  lastSnap: number;
}

export function startingServerData({ ctx }: SetupArg0, options: SetupOptions): ServerData {
  const playerCount: Record<string, number> = {};
  for (const pid of ctx.playOrder) {
    playerCount[pid] = 0;
  }

  return {
    sharedCount: options.startingValue,
    playerCount,
    lastSnap: 0,
  };
}
