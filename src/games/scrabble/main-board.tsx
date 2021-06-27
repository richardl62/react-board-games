import { Board, ClickDragState, makeBoardProps } from "../../boards";
import { SquareInteraction } from "../../boards/internal/square";
import { nestedArrayMap } from "../../shared/tools";
import { Letter, squareTypesArray } from "./game-properties";
import { squareColor, squareSize } from "./style";
import { Tile } from "./tile";

interface MainBoardProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[][];
}

const squareColors = nestedArrayMap(squareTypesArray, squareColor);

export function MainBoard({ letters, squareInteraction, clickDragState }: MainBoardProps) {
  const tiles = nestedArrayMap(letters, letter => letter && <Tile letter={letter} />
  );

  const boardProps = makeBoardProps(
    tiles,
    {
      squareBackground: sq => squareColors[sq.row][sq.col],
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    'mainBoard',
    squareInteraction,
    clickDragState.start
  );


  return <Board {...boardProps} />;
}