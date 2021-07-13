import { BoardProps } from '../board';
import { defaultColors, squareID, SquareID } from '../interfaces';

export interface BoardStyle {
  /** 
   * Function to mapping SquareID to color, or 'default' to mean
   * 'you pick the sytle'. 
  */
  squareBackground: string | ((sq: SquareID) => string );
  
  /** True means 'you pick the style'. */
  internalBorders: boolean;

  /** True means 'you pick the style'. */
  externalBorders: boolean | 'labelled';

  squareSize: string;
}

export function checkered(sq: SquareID) {
  const asTopLeft = (sq.row + sq.col) % 2 === 0;
  return asTopLeft ? defaultColors.whiteSquare : defaultColors.blackSquare;
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

  const backgroundColor = (row: number, col: number) : string => {
    if(typeof style.squareBackground === 'function') {
      return style.squareBackground(
        squareID(row, col, props.boardID)
      );
    }

    return style.squareBackground;
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
      props.borderWidth = `calc(${style.squareSize} / 2)`;
    } else {
      props.borderWidth = `4px`;
    }
  }
  
  if(style.internalBorders) {
    props.gridGap = "2px";
  }

  return props;
}