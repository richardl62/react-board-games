import { SetupArg0, SetupResult } from '../../game-control.js';

export interface ServerData {
  count: number;
}

export function startingServerData(_arg0: SetupArg0): SetupResult {
  return { state: { count: 0 } };
}
