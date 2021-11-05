import React, { useState } from "react";
import styled from "styled-components";
import { Board, makeBoardProps, SquareID } from "game-support/deprecated/boards";
import { sAssert } from "shared/assert";
import { boardIDs } from "../actions";
import { Actions } from "../actions";
import { squareSize } from "./style";
import { Tile } from "./tile";
import { useSquareInteraction } from "./square-interaction";

const StyledRackEtc = styled.div`
display:inline-flex;
gap: 1%;
`;

const PreRack = styled.div`
display: flex;
min-width: 9em;
justify-content: flex-end;
font: 2em;
align-items: center;
gap: 3%;
`;

interface RackProps {
  actions: Actions;
}

export function RankAndControls(props: RackProps): JSX.Element {
    const {  actions } = props;
    const hasTilesOut = actions.tilesOut();
    const coreTiles = props.actions.rack;
    const nTiles = coreTiles.length;

    const allowSwapping = actions.nTilesInBag >= actions.config.rackSize;
    const swapTiles = (toSwap: boolean[]) => {
        sAssert(allowSwapping);
        actions.swapTiles(toSwap);
        actions.endTurn(0);
    };

    const squareInteraction = useSquareInteraction(actions);

    // selectedForSwap is null if a swap is not in progress.
    const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);

    const tiles = coreTiles.map((tile, index) => tile && <Tile tile={tile}
        markAsMoveable={selectedForSwap !== null && selectedForSwap[index]}
    />);

    const toggleSelectForSwap = (sq: SquareID) => {
        return {
            onClick: () => {
                sAssert(selectedForSwap);
                const newSwappable = [...selectedForSwap];
                newSwappable[sq.col] = !newSwappable[sq.col];
                setSelectedForSwap(newSwappable);
            }
        };
    };

    const boardProps = makeBoardProps({
        pieces: [tiles],

        squareBackground: () => {return {color: "white", text:""};},
        externalBorders: true,
        internalBorders: true,
        squareSize: squareSize,
  
        boardID: boardIDs.rack,

        squareInteraction: selectedForSwap ? toggleSelectForSwap : squareInteraction,

        moveStart: null, //clickDragState.start,
    });

    if (selectedForSwap) {
        sAssert(swapTiles);

        const makeSwap = () => {

            setSelectedForSwap(null);
            // KLUDGE?: Relies to selectedForSwap not being immediately changed by
            // setSelectedForSwap.
            swapTiles(selectedForSwap);
        };
        const cancelSwap = () => {
            setSelectedForSwap(null);
        };
    
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
        );
    } else {

        const doEnableSwap = () => {
            sAssert(!selectedForSwap);
            actions.recallRack();
            setSelectedForSwap(Array(nTiles).fill(false));
        };

        return (<StyledRackEtc>
            <PreRack>
                {hasTilesOut && <button onClick={() => actions.recallRack()}>Recall</button>}
                <button
                    onClick={() => actions.shuffleRack()}
                >
          Shuffle
                </button>
            </PreRack>

            <Board {...boardProps} />

            {actions.isMyTurn && 
        <button 
            onClick={doEnableSwap}
            disabled={!swapTiles}
        >
          Swap
        </button>}

        </StyledRackEtc>
        );
    }
}