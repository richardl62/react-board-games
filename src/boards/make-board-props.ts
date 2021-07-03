import { ReactNode } from "react";
import { BoardElement, BoardProps } from "./board";
import { defaultColors, squareID, SquareID } from "./interfaces";
import { BoardStyle, setBoardStyle, checkered } from "./internal/set-board-style";
import { SquareInteraction } from "./internal/square";


 /** Helper function to make a Board */
export function makeBoardProps(
  pieces: (ReactNode|null)[][], 

  style: BoardStyle,

  /** board ID */
  boardID: string,

  /** Click and drag functions for the square 
   * (When called, sq.boardID will be input boardID.)
  */
  squareInteraction: (sq: SquareID) => SquareInteraction,

  moveStart: SquareID | null,
  ) : BoardProps 
{
  let elements: Array<Array<BoardElement>> = [];
  for(let row = 0; row < pieces.length; ++row) {
     elements[row] = [];
     for(let col = 0; col < pieces[row].length; ++col) {
        const sq = squareID(row, col, boardID);
        const elem = {
          piece: pieces[row][col],
          showHover: true,
          size: style.squareSize,
          ...squareInteraction(sq),
        }

        elements[row][col] = elem;
     }
  }
  
  if(moveStart && moveStart.boardID === boardID) {
    const {row, col} = moveStart;
    elements[row][col].backgroundColor = defaultColors.moveStart;
  }

  const boardProps : BoardProps = {
    elements: elements,
    boardID: boardID,
  }

  setBoardStyle(boardProps, style);

  return boardProps;
}

export { checkered };
