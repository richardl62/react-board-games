import { Board, ClickDragState, makeBoardProps } from "../../boards";
import { SquareInteraction } from "../../boards/internal/square";
import { nestedArrayMap } from "../../shared/tools";
import { Tile } from "./tile";
import { Letter } from "./scrabble";

interface MainBoardProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[][];
}
export function MainBoard({ letters, squareInteraction, clickDragState }: MainBoardProps) {
  const tiles = nestedArrayMap(letters, letter => letter && <Tile letter={letter} />
  );

  const boardProps = makeBoardProps(
    tiles,
    {
      squareBackground: true,
      externalBorders: true,
      internalBorders: true,
    },
    'mainBoard',
    squareInteraction,
    clickDragState.start
  );


  return <Board {...boardProps} />;
}
