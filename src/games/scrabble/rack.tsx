import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareInteraction } from "../../boards";
import { boardIDs } from "./game-actions";
import { Letter } from "./letter-properties";
import { squareSize } from "./style";
import { Tile } from "./tile";

const RackAndButtons = styled.div`
display:inline-flex;
gap: 1%;
margin-left: 5%;
`

const Button = styled.button<{visible?: boolean}>`
  visibility: ${props => props.visible === false ? 'hidden' : 'default'};
`
interface RackProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[];
  shuffle: () => void
  recall?: () => void;
}
export function Rack({ letters, squareInteraction, clickDragState, 
  shuffle, recall }: RackProps) {
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

  return (<RackAndButtons>
    <Button onClick={recall} visible={!!recall}>Recall</Button>
    <Button onClick={shuffle}>Shuffle</Button>
    <Board {...boardProps} />
  </RackAndButtons>);
}
