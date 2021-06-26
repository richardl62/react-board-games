import { Board, ClickDragState, makeBoardProps } from "../../boards";
import { SquareInteraction } from "../../boards/internal/square";
import { Tile } from "./tile";
import { Letter } from "./scrabble";
import { squareSize } from "./square-type";

interface RackProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[];
}
export function Rack({ letters, squareInteraction, clickDragState }: RackProps) {
  const tiles = letters.map(letter => letter && <Tile letter={letter} />
  );

  const boardProps = makeBoardProps(
    [tiles],
    {
      squareBackground: false,
      externalBorders: false,
      internalBorders: false,
      squareSize: squareSize,
    },
    'mainBoard',
    squareInteraction,
    clickDragState.start
  );

  return <Board {...boardProps} />;
}
