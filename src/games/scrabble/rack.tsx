import React, { useState } from "react";
import styled from "styled-components";
import { Board, ClickDragState, makeBoardProps, SquareID, SquareInteractionFunc } from "../../boards";
import { gAssert } from "../../shared/assert";
import { ClientMoves } from "./bgio-moves";
import { boardIDs, tilesOut } from "./game-actions";
import { Rack as RackType } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
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

interface RackProps extends ScrabbleBoardProps {
  squareInteraction: SquareInteractionFunc;
  clickDragState: ClickDragState;
  rack: RackType;
  swapTiles: (toSwap: boolean[]) => void;
}

export function RackEtc(props: RackProps) {
  const { playerID, G, ctx, squareInteraction, clickDragState, swapTiles} = props;
  const moves = props.moves as any as ClientMoves;
  const hasTilesOut = tilesOut(G);
  const letters = props.rack;
  const nLetters = letters.length;

  const isMyTurn =  playerID === ctx.currentPlayer;

  // selectedForSwap is null if a swap is not in progress.
  const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);

  const tiles = letters.map((letter, index) => letter && <Tile letter={letter}
    markAsMoveable={selectedForSwap !== null && selectedForSwap[index]}
    />);

  const toggleSelectForSwap = (sq: SquareID) => {
    return {
      onClick: () => {
        gAssert(selectedForSwap);
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
      gAssert(!selectedForSwap);
      moves.recallRack();
      setSelectedForSwap(Array(nLetters).fill(false));
    }

    return (<StyledRackEtc>
      <PreRack>
        {hasTilesOut && <button onClick={() => moves.recallRack()}>Recall</button>}
        <button 
          onClick={() => moves.shuffleRack()}
          disabled={!isMyTurn}
        >
          Shuffle
          </button>
      </PreRack>

      <Board {...boardProps} />

      <button 
        onClick={doEnableSwap}
        disabled={!isMyTurn}
      >
        Swap
      </button>

    </StyledRackEtc>
    );
  };
}