import React, { useState } from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { Rack } from "./rack";
import { BoardData } from "../server-side/game-state";
import { useScrabbleContext } from "../client-side/scrabble-context";

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

const ButtonNoWrap = styled.button`
    white-space: nowrap;
`;

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

export function RackAndControls(): JSX.Element {
    const context = useScrabbleContext();

    const hasTilesOut = tilesOut(context.board);
    const nTiles =  context.rack.length;

    // selectedForSwap is null if a swap is not in progress.
    const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);



    if (selectedForSwap) {

        const makeSwap = () => {

            setSelectedForSwap(null);
            // Note: Relies on selectedForSwap not being immediately changed by
            // setSelectedForSwap.
            const checkedRack = context.rack.map(l => {
                sAssert(l);
                return l;
            });
            context.wrappedGameProps.moves.swapTiles({rack: checkedRack, toSwap: selectedForSwap});           
        };
        const cancelSwap = () => {
            setSelectedForSwap(null);
        };

        const nToSwap = selectedForSwap.filter(s => s).length;
        
        return (
            <StyledRackAndControls>
                <PreRack>
                    <span>Toggle tiles to swap </span>
                </PreRack>

                <Rack selected={selectedForSwap} setSelected={setSelectedForSwap}/>

                {nToSwap > 0 &&
                    <ButtonNoWrap onClick={makeSwap}>Make swap ({nToSwap} tiles)</ButtonNoWrap>}
                <button onClick={cancelSwap}>Cancel</button>
            </StyledRackAndControls>
        );
    } else {

        const allowSwapping = context.nTilesInBag >= context.rack.length;
        const doEnableSwap = () => {
            sAssert(!selectedForSwap);
            context.dispatch({type: "recallRack"});
            setSelectedForSwap(Array(nTiles).fill(true));
        };

        const recallRack = () =>  context.dispatch({type: "recallRack"});
        const shuffleRack = () =>  context.dispatch({type: "shuffleRack"});

        const isMyTurn = context.playerID === context.currentPlayer; 

        return (<StyledRackAndControls>
            <PreRack>
                {hasTilesOut && <button onClick={recallRack}>Recall</button>}
                <button
                    onClick={shuffleRack}
                >
                    Shuffle
                </button>
            </PreRack>

            <Rack selected={selectedForSwap} setSelected={setSelectedForSwap}/>

            {isMyTurn &&
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
