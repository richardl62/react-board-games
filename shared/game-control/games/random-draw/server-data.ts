import { SetupArg0, SetupResult } from '../../game-control.js';
import { valuesPerPlayer, maxValue } from './config.js';

export interface ServerData {
  playerValues: Record<string, number[]>;
}

export function startingServerData(arg0: SetupArg0): SetupResult {
  const { ctx, random } = arg0;

  const playerValues: ServerData['playerValues'] = {};

  for (const pid of ctx.playOrder) {
    playerValues[pid] = [];
    for (let i = 0; i < valuesPerPlayer; i++) {
      playerValues[pid].push(random.Die(maxValue));
    }
  }

  return { state: { playerValues } };
}
