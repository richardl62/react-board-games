import React, { useState } from "react";
import styled from "styled-components";
import { sAssert } from "shared/assert";
import { Actions } from "../actions";
import { Rack } from "./rack";
import { swapTiles } from "../actions/bgio-moves";
import { BoardData } from "../actions/global-game-state";

const StyledRackAndControls = styled.div`
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

interface RackAndControlsProps {
    actions: Actions;
}

/** 
* Report whether there are active tiles on the board.
* 
* Active tiles are those taken from the rack. 
*
* Note: For most of the game this is equivalent to checking if the rank has 
* gaps. But difference can occur at the end of the game when the bag is emtpy.
*
* TO DO:  Consider making this part of BoardAndRack.
*/
function tilesOut(board: BoardData): boolean {
    return !!board.find(row => row.find(sq => sq?.active));
}

export function RackAndControls(props: RackAndControlsProps): JSX.Element {
    const { actions } = props;

    const hasTilesOut = tilesOut(actions.localState.board);
    const nTiles =  actions.localState.rack.length;

    // selectedForSwap is null if a swap is not in progress.
    const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);



    if (selectedForSwap) {

        const makeSwap = () => {

            setSelectedForSwap(null);
            // KLUDGE?: Relies to selectedForSwap not being immediately changed by
            // setSelectedForSwap.
            swapTiles(actions.localState, actions.bgioProps, selectedForSwap);
        };
        const cancelSwap = () => {
            setSelectedForSwap(null);
        };

        return (
            <StyledRackAndControls>
                <PreRack>
                    <span>Select times to swap </span>
                </PreRack>

                <Rack actions={actions} selected={selectedForSwap} setSelected={setSelectedForSwap}/>

                {selectedForSwap.includes(true) &&
                    <button onClick={makeSwap}>Make Swap</button>}
                <button onClick={cancelSwap}>Cancel</button>
            </StyledRackAndControls>
        );
    } else {

        const allowSwapping = actions.localState.bag.length >= actions.localState.rack.length;
        const doEnableSwap = () => {
            sAssert(!selectedForSwap);
            actions.dispatch({type: "recallRack"});
            setSelectedForSwap(Array(nTiles).fill(false));
        };

        const recallRack = () =>  actions.dispatch({type: "recallRack"});
        const shuffleRack = () =>  actions.dispatch({type: "shuffleRack"});

        return (<StyledRackAndControls>
            <PreRack>
                {hasTilesOut && <button onClick={recallRack}>Recall</button>}
                <button
                    onClick={shuffleRack}
                >
                    Shuffle
                </button>
            </PreRack>

            <Rack actions={actions} selected={selectedForSwap} setSelected={setSelectedForSwap}/>

            {actions.bgioProps.isMyTurn &&
                <button
                    disabled={!allowSwapping}
                    onClick={doEnableSwap}
                >
                    Swap
                </button>}

        </StyledRackAndControls>
        );
    }
}
