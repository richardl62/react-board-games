import React from "react";
import { Board, ClickDragState, makeBoardProps, SquareInteractionFunc } from "../../boards";
import { nestedArrayMap } from "../../shared/tools";
import { boardIDs } from "./game-actions";
import { ScrabbleConfig } from "./scrabble-config";
import { scrabbleSquareBackground, squareSize } from "./style";
import { Tile } from "./tile";
import { BoardData } from "./game-data";

interface MainBoardProps {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
  board: BoardData;
  scrabbleConfig: ScrabbleConfig;
}



export function MainBoard({ board, squareInteraction, scrabbleConfig, clickDragState }: MainBoardProps) {

  const tiles = nestedArrayMap(board, sd => {
    if (!sd) return null;
    const markAsMoveable = sd.active;
    return <Tile letter={sd.letter} markAsMoveable={markAsMoveable} />
  });

  const squareColors = nestedArrayMap(
    scrabbleConfig.boardLayout,
    scrabbleSquareBackground
  );

  const boardProps = makeBoardProps({
    pieces: tiles,

    squareBackground: sq => squareColors[sq.row][sq.col],
    externalBorders: true,
    internalBorders: true,
    squareSize: squareSize,

    boardID: boardIDs.main,
    squareInteraction: squareInteraction,
    moveStart: clickDragState.start,
  });

  return <Board {...boardProps} />;
}
