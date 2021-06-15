import { ReactNode } from "react";
import { map2DArray } from "../shared/tools";
import { BoardElement, BoardProps } from "./board";
import { defaultColors, RowCol } from "./interfaces";
import { addOnFunctions } from "./internal/add-on-functions";
import { makeCheckered } from "./internal/make-checkered";
import { OnFunctions } from "./internal/square";

export function makeBoardProps(
  pieces: ReactNode[][], 
  style: 'checkered', // Only one option for now.
  onFunctions?: OnFunctions,
  moveStart?: RowCol | null,
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
  }

  if(onFunctions) {
    addOnFunctions(boardProps, onFunctions);
  }

  makeCheckered(boardProps);
  if(moveStart) {
    const {row, col} = moveStart;
    boardProps.elements[row][col].backgroundColor = defaultColors.moveStart;
  }

  return boardProps;
}