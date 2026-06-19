import { ServerData } from './server-data.js';
import { MoveArg0 } from '../../move-fn.js';

export function addPlayerCount({ G, viewingPlayer }: MoveArg0<ServerData>, value: number): void {
  G.playerCount[viewingPlayer] += value;
}
