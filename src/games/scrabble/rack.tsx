import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareInteraction } from "../../boards";
import { boardIDs } from "./game-actions";
import { Letter } from "./letter-properties";
import { squareSize } from "./style";
import { Tile } from "./tile";

const RackAndButton = styled.div`
display:flex;
gap: 5px;
`
interface RackProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[];
  shuffle: () => void
}
export function Rack({ letters, squareInteraction, clickDragState, shuffle }: RackProps) {
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

  return (<RackAndButton>
    <button onClick={shuffle}>Shuffle</button>
    <Board {...boardProps} />
  </RackAndButton>);
}
