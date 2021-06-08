import { BoardProps } from './board';
import { defaultColors, squareSize } from './interfaces';

export function checkeredColor(row: number, col: number) {
  const asTopLeft = (row + col) % 2 === 0;
  return asTopLeft ? defaultColors.whiteSquare : defaultColors.blackSquare;
}

/** Modify the input props to make it suitable for a checkered board.
 * This involves setting colors and boarder properies.
 *  
 * Props are modified in place. The input props (after modification) are 
 * returned.
 */
export function makeCheckered(
  props: BoardProps
): BoardProps {

  const { elements } = props;

  for (let rowNum = 0; rowNum < elements.length; ++rowNum) {
    const row = elements[rowNum];

    for (let colNum = 0; colNum < row.length; ++colNum) {
      row[colNum].backgroundColor = checkeredColor(rowNum, colNum); 
    }
  }

  props.borderLabels = true;
  props.borderWidth = `calc(${squareSize} / 2)`
  

  return props;
}