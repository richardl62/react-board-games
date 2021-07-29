import React, { useState } from "react";
import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareID, SquareInteractionFunc } from "../../boards";
import assert from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { boardIDs, tilesOut } from "./game-actions";
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

interface RackProps extends BoardProps<GameData> {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
}

export function Rack(props: RackProps) {
  const { squareInteraction, clickDragState, G } = props;
  const moves = props.moves as any as ClientMoves;
  const hasTilesOut = tilesOut(G);
  const letters = G.playerData[G.currentPlayer].rack
  const nLetters = letters.length;

  const [swappable, setSwappable] = useState<boolean[] | null>(null);

  const tiles = letters.map((letter, index) => letter && <Tile letter={letter}
    markAsMoveable={swappable !== null && swappable[index]}
    />);

  const swapInteraction = (sq: SquareID) => {
    return {
      onClick: () => {
        assert(swappable);
        let newSwappable = [...swappable];
        newSwappable[sq.col] = !newSwappable[sq.col];
        setSwappable(newSwappable);
      }
    }
  };

  const boardProps = makeBoardProps({
    pieces: [tiles],

    squareBackground: (siq: SquareID) => {return {color: "white", text:""}},
    externalBorders: true,
    internalBorders: true,
    squareSize: squareSize,
  
    boardID: boardIDs.rack,

    squareInteraction: swappable ? swapInteraction : squareInteraction,

    moveStart: clickDragState.start,
  });

  if (swappable) {
    const makeSwap = () => {
      assert(swappable);
      moves.swapTilesInRack(swappable);
      setSwappable(null);
    }

    const cancelSwap = () => {
      setSwappable(null);
    }
    
    return (
      <RackAndButtons>
        <PreRack>
           <span>Select times to swap </span>
        </PreRack>

        <Board {...boardProps} />

        {swappable.includes(true) && <button onClick={makeSwap}>Make Swap</button> }
        <button onClick={cancelSwap}>Cancel</button>
      </RackAndButtons>
    )
  } else {

    const doEnableSwap = () => {
      assert(!swappable);
      moves.recallRack();
      setSwappable(Array(nLetters).fill(false));
    }

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