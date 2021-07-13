import { Board, ClickDragState, makeBoardProps, SquareInteractionFunc } from "../../boards";
import { nestedArrayMap } from "../../shared/tools";
import { boardIDs } from "./game-actions";
import { squareTypesArray } from "./board-properties";
import { squareColor, squareSize } from "./style";
import { Tile } from "./tile";
import { BoardData } from "./game-data";

interface MainBoardProps {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
  board: BoardData;
}

const squareColors = nestedArrayMap(squareTypesArray, squareColor);

export function MainBoard({ board, squareInteraction, clickDragState }: MainBoardProps) {

  const tiles = nestedArrayMap(board, sd => {
    if(!sd) return null;
    const markAsMoveable = sd.active;
    return <Tile letter={sd.letter} markAsMoveable={markAsMoveable}/>
  });

  const boardProps = makeBoardProps({
    pieces: tiles,
    style: {
      squareBackground: sq => squareColors[sq.row][sq.col],
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    boardID: boardIDs.main,
    squareInteraction: squareInteraction,
    moveStart: clickDragState.start,
  });

  return <Board {...boardProps} />;
}
