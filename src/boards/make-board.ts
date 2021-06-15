import { ReactNode } from "react";
import { map2DArray } from "../shared/tools";
import { addOnFunctions } from "./internal/add-on-functions";
import { BoardElement, BoardProps } from "./board";
import { ClickDrag } from "./click-drag";
import { makeCheckered } from "./internal/make-checkered";

export function makeBoardProps(pieces: ReactNode[][], style: 'checkered', clickDrag: ClickDrag) : BoardProps {
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

  addOnFunctions(boardProps, clickDrag.basicOnFunctions());
  makeCheckered(boardProps);
  if(clickDrag.start) {
    const {row, col} = clickDrag.start;
    boardProps.elements[row][col].backgroundColor = 'gold';
  }

  return boardProps;
}