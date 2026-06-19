import { ServerData } from './server-data.js';
import { MoveArg0 } from '../../move-fn.js';

export function addSharedCount({ G }: MoveArg0<ServerData>, value: number): void {
  G.sharedCount += value;
  if (G.sharedCount < 0) {
    throw new Error('Count is negative (test of error handling)');
  }
}
