import React, { useState } from "react";
import styled from "styled-components";
import { Board, makeBoardProps, SquareID, SquareInteractionFunc } from "../../boards";
import { sAssert } from "../../shared/assert";
import { boardIDs, tilesOut } from "./game-actions";
import { ScrabbleData, Rack as RackType } from "./scrabble-data";
import { squareSize } from "./style";
import { Tile } from "./tile";

const StyledRackEtc = styled.div`
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

interface RackProps {
  squareInteraction: SquareInteractionFunc;
  rack: RackType;
  swapTiles: (toSwap: boolean[]) => void;
  scrabbleData: ScrabbleData;
}

export function RackEtc(props: RackProps) {
  const {squareInteraction, swapTiles, scrabbleData } = props;
  const hasTilesOut = tilesOut(scrabbleData.board);
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
        sAssert(selectedForSwap);
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

    moveStart: null, //clickDragState.start,
  });

  if (selectedForSwap) {
    const makeSwap = () => {
      setSelectedForSwap(null);
      // KLUDGE?: Relies to selectedForSwap not being immediately changed by
      // setSelectedForSwap.
      swapTiles(selectedForSwap);
    }
    const cancelSwap = () => {
      setSelectedForSwap(null);
    }
    
    return (
      <StyledRackEtc>
        <PreRack>
           <span>Select times to swap </span>
        </PreRack>

        <Board {...boardProps} />

        {selectedForSwap.includes(true) && 
          <button onClick={makeSwap}>Make Swap</button> }
        <button onClick={cancelSwap}>Cancel</button>
      </StyledRackEtc>
    )
  } else {

    const doEnableSwap = () => {
      sAssert(!selectedForSwap);
      scrabbleData.recallRack();
      setSelectedForSwap(Array(nLetters).fill(false));
    }

    return (<StyledRackEtc>
      <PreRack>
        {hasTilesOut && <button onClick={() => scrabbleData.recallRack()}>Recall</button>}
        <button 
          onClick={() => scrabbleData.shuffleRack()}
          disabled={!scrabbleData.isMyTurn}
        >
          Shuffle
          </button>
      </PreRack>

      <Board {...boardProps} />

      <button 
        onClick={doEnableSwap}
        disabled={!scrabbleData.isMyTurn}
      >
        Swap
      </button>

    </StyledRackEtc>
    );
  };
}