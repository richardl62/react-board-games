import { ClientMoveFunctions } from '../../move-fn.js';
import { addPlayerCount } from './add-player-count.js';
import { addSharedCount } from './add-shared-count.js';

export const moves = {
  addSharedCount,
  addPlayerCount,
};

export type ClientMoves = ClientMoveFunctions<typeof moves>;
