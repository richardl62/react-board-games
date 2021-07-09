import { useState } from "react";
import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareID, SquareInteractionFunc } from "../../boards";
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

const StartingButtons = styled.div`
display:inline-flex;
min-width: 50px;
justify-content: right;
`

const Button = styled.button<{visible?: boolean, pressed?: boolean}>`
  visibility: ${props => props.visible === false ? 'hidden' : 'default'};
  color: ${props => props.pressed === true ? 'red' : 'default'};
`

interface RackProps extends Bgio.BoardProps<GameData> {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
}
export function Rack({ squareInteraction, clickDragState, G, moves } : RackProps ) {;
  const hasTilesOut = tilesOut(G);
  const letters = G.playerData[playerNumber].rack
  const tiles = letters.map(letter => letter && <Tile letter={letter} />);
  
  const [enableSwap, setEnableSwap] = useState(true);

  const swapInteraction = (sq: SquareID) => {
    return {
      onClick: () => (console.log(sq))
    }
  };
  const boardProps = makeBoardProps(
    [tiles],
    {
      squareBackground: true,
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    boardIDs.rack,

    enableSwap ? swapInteraction : squareInteraction,
    
    clickDragState.start, 
  );

  const toggleEnableSwap = () => {
    moves.recallRack();
    setEnableSwap(!enableSwap);
  }

  return (<RackAndButtons>
    <StartingButtons>
      {!enableSwap && hasTilesOut && <Button onClick={moves.recallRack}>Recall</Button>}
      {!enableSwap && !hasTilesOut && <Button onClick={moves.shuffleRack}>Shuffle</Button>}
      {enableSwap && <Button>Commit</Button>}
    </StartingButtons>

    <Board {...boardProps} />

    <Button onClick={toggleEnableSwap} pressed={enableSwap}>Swap</Button>

  </RackAndButtons>);
}
