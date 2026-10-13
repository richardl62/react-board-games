import { AppGame, GameCategory } from '../../app-game-support/app-game';
import { standardBoard } from '../../app-game-support/standard-board';
import React from 'react';
import { gameControl } from '@game-control/games/ticker/game-control';

const LazyBoard = React.lazy(() => import('./board/board'));

export const appGame: AppGame = {
  ...gameControl,

  displayName: 'Ticker',
  category: GameCategory.test,
  supportGameControlsDefault: false,

  board: (props) => standardBoard(LazyBoard, props),
};
