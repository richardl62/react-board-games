import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareInteractionFunc } from "../../boards";
import { Bgio } from "../../shared/types";
import { boardIDs, playerNumber, tilesOut } from "./game-actions";
import { GameData } from "./game-data";
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

interface RackProps extends Bgio.BoardProps<GameData> {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
}
export function Rack({ squareInteraction, clickDragState, G, moves } : RackProps ) {;
  const hasTilesOut = tilesOut(G);
  const letters = G.playerData[playerNumber].rack
  const tiles = letters.map(letter => letter && <Tile letter={letter} />);
  

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
    <Button onClick={moves.recall} visible={hasTilesOut}>Recall</Button>
    <Button onClick={moves.shuffle}>Shuffle</Button>
    <Board {...boardProps} />
  </RackAndButtons>);
}
