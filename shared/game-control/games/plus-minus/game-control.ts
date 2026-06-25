import { GameControl } from '../../game-control.js';
import { moves } from './moves.js';
import { PlayerGameData, startingServerData } from './server-data.js';

export const gameControl: GameControl = {
  name: 'plusminus',

  setup: startingServerData,

  minPlayers: 1,
  maxPlayers: 8,

  moves,

  setupPlayerData: (): PlayerGameData => ({ count: 0 }),
};
