import { Board, ClickDragState, makeBoardProps, SquareInteraction } from "../../boards";
import { boardIDs } from "./game-actions";
import { Letter } from "./letter-properties";
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

  const boardProps = makeBoardProps(
    [tiles],
    {
      squareBackground: true,
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    boardIDs.rack,
    squareInteraction,
    clickDragState.start
  );

  return <Board {...boardProps} />;
}
