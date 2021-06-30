import { Board, ClickDragState, makeBoardProps, SquareInteraction } from "../../boards";
import { nestedArrayMap } from "../../shared/tools";
import { boardIDs } from "./game-actions";
import { squareTypesArray } from "./board-properties";
import { squareColor, squareSize } from "./style";
import { Tile } from "./tile";
import { SquareData } from "./game-data";

interface MainBoardProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  board: (SquareData | null)[][];
}

const squareColors = nestedArrayMap(squareTypesArray, squareColor);

export function MainBoard({ board, squareInteraction, clickDragState }: MainBoardProps) {

  const tiles = nestedArrayMap(board, sd => {
    if(!sd) return null;
    const markAsMovable = sd.active;
    return <Tile letter={sd.letter} markAsMovable={markAsMovable}/>
  });

  const boardProps = makeBoardProps(
    tiles,
    {
      squareBackground: sq => squareColors[sq.row][sq.col],
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    boardIDs.main,
    squareInteraction,
    clickDragState.start
  );


  return <Board {...boardProps} />;
}
