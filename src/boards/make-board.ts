import { ReactNode } from "react";
import { nestedArrayMap } from "../shared/tools";
import { BoardElement, BoardProps } from "./board";
import { defaultColors, SquareID } from "./interfaces";
import { setBoardStyle } from "./internal/set-board-style";
import { SquareInteraction } from "./internal/square";



 /** Helper function to make a Board */
export function makeBoardProps(
  pieces: ReactNode[][], 

  /** Board style: plain or checkered */
  style: 'plain'|'checkered',

  /** board ID */
  boardID: string,

  squareInteraction?: SquareInteraction,
  moveStart?: SquareID | null,
  ) : BoardProps 
{
  const elements = nestedArrayMap(pieces, piece => {
    const elem: BoardElement = {
      piece: piece,
      showHover: true,
    }
    return elem;
  })
  const boardProps : BoardProps = {
    elements: elements,
    boardID: boardID,
  }

  if(squareInteraction) {
    boardProps.elements = nestedArrayMap(boardProps.elements, 
      elem => {return {...elem, ...squareInteraction}}   
     )
  }

  setBoardStyle(boardProps, style);
  if(moveStart && moveStart.boardID === "boardID") {
    const {row, col} = moveStart;
    boardProps.elements[row][col].backgroundColor = defaultColors.moveStart;
  }

  return boardProps;
}