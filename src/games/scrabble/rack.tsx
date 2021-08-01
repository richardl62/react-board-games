import React, { useState } from "react";
import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareID, SquareInteractionFunc } from "../../boards";
import assert from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { boardIDs, tilesOut } from "./game-actions";
import { GameData, Rack as RackType } from "./game-data";
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
  rack: RackType;
  swapTiles: (toSwap: boolean[]) => void;
}

export function Rack(props: RackProps) {
  const {  G, squareInteraction, clickDragState, swapTiles} = props;
  const moves = props.moves as any as ClientMoves;
  const hasTilesOut = tilesOut(G);
  const letters = props.rack;
  const nLetters = letters.length;

  // selectedForSwap is null if a swap is not in progress.
  const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);

  const tiles = letters.map((letter, index) => letter && <Tile letter={letter}
    markAsMoveable={selectedForSwap !== null && selectedForSwap[index]}
    />);

  const toggleSelectForSwap = (sq: SquareID) => {
    return {
      onClick: () => {
        assert(selectedForSwap);
        let newSwappable = [...selectedForSwap];
        newSwappable[sq.col] = !newSwappable[sq.col];
        setSelectedForSwap(newSwappable);
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

    squareInteraction: selectedForSwap ? toggleSelectForSwap : squareInteraction,

    moveStart: clickDragState.start,
  });

  if (selectedForSwap) {
    const cancelSwap = () => {
      setSelectedForSwap(null);
    }
    
    return (
      <RackAndButtons>
        <PreRack>
           <span>Select times to swap </span>
        </PreRack>

        <Board {...boardProps} />

        {selectedForSwap.includes(true) && 
          <button onClick={() => swapTiles(selectedForSwap)}>Make Swap</button> }
        <button onClick={cancelSwap}>Cancel</button>
      </RackAndButtons>
    )
  } else {

    const doEnableSwap = () => {
      assert(!selectedForSwap);
      moves.recallRack();
      setSelectedForSwap(Array(nLetters).fill(false));
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