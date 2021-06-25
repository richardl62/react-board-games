import { BoardProps } from '../board';
import { defaultColors, SquareID, squareSize } from '../interfaces';

export interface BoardStyle {
  /** 
   * Boolean, 'checkered' or function mapping SquareID to color 
   * True means 'you pick the sytle'. 
  */
  squareBackground: boolean | ((sq: SquareID) => string);
  
  /** True means 'you pick the sytle'. */
  internalBorders: boolean;

  /** True means 'you pick the sytle'. */
  externalBorders: boolean | 'labelled';
}

export function checkered(sq: SquareID) {
  const asTopLeft = (sq.row + sq.col) % 2 === 0;
  return asTopLeft ? defaultColors.whiteSquare : defaultColors.blackSquare;
}

function squareID(row: number, col: number, boardID: string) : SquareID {
  return {
    row: row,
    col: col,
    boardID: boardID,
  }
}
/** Modify the input props to make it suitable for a checkered board.
 * This involves setting colors and boarder properies.
 *  
 * Props are modified in place. The input props (after modification) are 
 * returned.
 */
export function setBoardStyle(
  props: BoardProps,
  style: BoardStyle,
): BoardProps {

  const { elements } = props;

  const backgroundColor = (row: number, col: number) => {
    if(typeof style.squareBackground === 'function') {
      return style.squareBackground(
        squareID(row, col, props.boardID)
      );
    }
  }

  for (let rowNum = 0; rowNum < elements.length; ++rowNum) {
    const row = elements[rowNum];
    for (let colNum = 0; colNum < row.length; ++colNum) {
        row[colNum].backgroundColor = backgroundColor(rowNum, colNum);
    }
  }


  if (style.externalBorders) {

    if(style.externalBorders === 'labelled') {
      props.borderLabels = true;  
      props.borderWidth = `calc(${squareSize} / 2)`;
    } else {
      props.borderWidth = `4px`;
    }
  }
  
  if(style.internalBorders) {
    props.gridGap = "2px";
  }

  return props;
}