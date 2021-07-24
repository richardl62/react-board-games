import { ReactNode } from "react";
import { BoardElement, BoardProps } from "./board";
import { defaultColors, SquareBackgroundProps, squareID, SquareID } from "./interfaces";
import { BoardStyle, setBoardStyle, checkered } from "./internal/set-board-style";
import { SquareInteraction } from "./internal/square";


/** Helper function to make a Board */
interface MakeBoardPropsParam {
  pieces: (ReactNode | null)[][];

  /** 
   * Function to mapping SquareID to color, or 'default' to mean
   * 'you pick the sytle'. 
  */
  squareBackground: string | ((sq: SquareID) => SquareBackgroundProps);

  /** True means 'you pick the style'. */
  internalBorders: boolean;

  /** True means 'you pick the style'. */
  externalBorders: boolean | 'labelled';

  squareSize: string;

  /** board ID */
  boardID: string;

  /** Click and drag functions for the square 
   * (When called, sq.boardID will be input boardID.)
  */
  squareInteraction: (sq: SquareID) => SquareInteraction;

  moveStart: SquareID | null;
}

export function makeBoardProps(props: MakeBoardPropsParam): BoardProps {
  const { pieces, squareSize, boardID, squareInteraction, moveStart } = props;
  let elements: Array<Array<BoardElement>> = [];
  for (let row = 0; row < pieces.length; ++row) {
    elements[row] = [];
    for (let col = 0; col < pieces[row].length; ++col) {
      const sq = squareID(row, col, boardID);
      const elem = {
        piece: pieces[row][col],
        showHover: true,
        size: squareSize,
        background: {
          color: defaultColors.square,
          text: "",
        },
        ...squareInteraction(sq),
      }

      elements[row][col] = elem;
    }
  }

  if (moveStart && moveStart.boardID === boardID) {
    const { row, col } = moveStart;
    elements[row][col].background.color = defaultColors.moveStart;
  }

  const boardProps: BoardProps = {
    elements: elements,
    boardID: boardID,
  }

  const style: BoardStyle = props; // KLUDGE?
  setBoardStyle(boardProps, style);

  return boardProps;
}

export { checkered };
