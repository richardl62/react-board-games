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
`

const PreRack = styled.div`
display: flex;
min-width: 9em;
justify-content: flex-end;
font: 2em;
align-items: center;
gap: 3%;
`

interface RackProps extends Bgio.BoardProps<GameData> {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
}
export function Rack({ squareInteraction, clickDragState, G, moves }: RackProps) {
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

  const doEnableSwap = () => {
    moves.recallRack();
    setEnableSwap(true);
  }
  const swapDone = () => {
    setEnableSwap(false);
  }
  if (enableSwap) {
    return (
      <RackAndButtons>
        <PreRack>
          {enableSwap && <span>Select times to swap </span>}
        </PreRack>

        <Board {...boardProps} />

        <button onClick={swapDone}>Done</button>
      </RackAndButtons>
    )
  } else {

    return (<RackAndButtons>
      <PreRack>
        {hasTilesOut && <button onClick={moves.recallRack}>Recall</button>}
        <button onClick={moves.shuffleRack}>Shuffle</button>
      </PreRack>

      <Board {...boardProps} />

      <button onClick={doEnableSwap}>Swap</button>

    </RackAndButtons>
    );
  };
}