import { defaultColors } from './interfaces';
import { SquareDef } from '../games/simple/swap-squares';

export function checkeredColor(row: number, col: number, sq: SquareDef) {
  if (sq.moveStart) {
    return 'gold';
  }

  const asTopLeft = (row + col) % 2 === 0;
  return asTopLeft ? defaultColors.whiteSquare : defaultColors.blackSquare;
}
