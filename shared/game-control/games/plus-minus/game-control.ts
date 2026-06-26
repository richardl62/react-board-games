import { GameControl } from '../../game-control.js';
import { moves } from './moves.js';
import { startingServerData } from './server-data.js';

export const gameControl: GameControl = {
  name: 'plusminus',

  minPlayers: 1,
  maxPlayers: 8,

  setup: startingServerData,

  moves,
};
