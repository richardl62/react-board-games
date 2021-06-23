import { ReactNode } from "react";
import { map2DArray } from "../shared/tools";
import { BoardElement, BoardProps } from "./board";
import { defaultColors, SquareID } from "./interfaces";
import { setBoardStyle } from "./internal/set-board-style";
import { SquareInteraction } from "./internal/square";

export function makeBoardProps(
  pieces: ReactNode[][], 
  style: 'plain'|'checkered',
  boardID: string,
  squareInteraction?: SquareInteraction,
  moveStart?: SquareID | null,
  ) : BoardProps {
  const elements = map2DArray(pieces, piece => {
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
    boardProps.elements = map2DArray(boardProps.elements, 
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