import { Board, ClickDragState, makeBoardProps } from "../../boards";
import { SquareInteraction } from "../../boards/internal/square";
import { Letter } from "./game-properties";
import { squareSize } from "./style";
import { Tile } from "./tile";

interface RackProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[];
}
export function Rack({ letters, squareInteraction, clickDragState }: RackProps) {
  const tiles = letters.map(letter => letter && <Tile letter={letter} />
  );
  tiles.push(null)

  const boardProps = makeBoardProps(
    [tiles],
    {
      squareBackground: true,
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
