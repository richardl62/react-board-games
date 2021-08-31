import React from "react";
import { Board, makeBoardProps, SquareInteractionFunc } from "../../boards";
import { nestedArrayMap } from "../../shared/tools";
import { boardIDs } from "./game-actions";
import { ScrabbleConfig } from "./scrabble-config";
import { scrabbleSquareBackground, squareSize } from "./style";
import { Tile } from "./tile";
import { BoardData } from "./game-data";

interface MainBoardProps {
  squareInteraction: SquareInteractionFunc;
  board: BoardData;
  config: ScrabbleConfig;
}

// KUUDGE: Copy and paste - same code elsewhere
let lastCall = new Date();
function logTime(name: String) {
  const date = new Date();
  const ellapsed = (date.getTime() - lastCall.getTime()) / 1000;
  lastCall = date;

  const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const now = `${hour}:${minutes}:${seconds}`;
  console.log(name, now, `(${ellapsed})`);
}

export function MainBoard({ board, squareInteraction, config }: MainBoardProps) {

  const tiles = nestedArrayMap(board, sd => {
    if (!sd) return null;
    const markAsMoveable = sd.active;
    return <Tile letter={sd.letter} markAsMoveable={markAsMoveable} />
  });

  const squareColors = nestedArrayMap(
    config.boardLayout,
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
    moveStart: null, //clickDragState.start,
  });
  logTime("Scrabble board");
  return <Board {...boardProps} />;
}
