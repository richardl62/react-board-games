import { SetupArg0 } from '../../game-control.js';

export interface SetupOptions {
  readonly startingValue: number;
}

export interface ServerData {
  sharedCount: number;

  playerCount: Record<string, number>;
}

export function startingServerData({ ctx }: SetupArg0, options: SetupOptions): ServerData {
  const playerCount: Record<string, number> = {};
  for (const pid of ctx.playOrder) {
    playerCount[pid] = 0;
  }

  return {
    sharedCount: options.startingValue,
    playerCount,
  };
}
