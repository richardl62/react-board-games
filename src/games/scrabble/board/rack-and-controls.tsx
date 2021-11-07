import React, { useState } from "react";
import styled from "styled-components";
import { sAssert } from "shared/assert";
import { Actions } from "../actions";
import { Rack } from "./rack";

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

export function RackAndControls(props: RackAndControlsProps): JSX.Element {
    const { actions } = props;
    const hasTilesOut = actions.tilesOut();
    const nTiles =  props.actions.rack.length;

    // selectedForSwap is null if a swap is not in progress.
    const [selectedForSwap, setSelectedForSwap] = useState<boolean[] | null>(null);



    if (selectedForSwap) {

        const makeSwap = () => {

            setSelectedForSwap(null);
            // KLUDGE?: Relies to selectedForSwap not being immediately changed by
            // setSelectedForSwap.
            actions.swapTiles(selectedForSwap);
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

        const doEnableSwap = () => {
            sAssert(!selectedForSwap);
            actions.recallRack();
            setSelectedForSwap(Array(nTiles).fill(false));
        };

        return (<StyledRackAndControls>
            <PreRack>
                {hasTilesOut && <button onClick={() => actions.recallRack()}>Recall</button>}
                <button
                    onClick={() => actions.shuffleRack()}
                >
                    Shuffle
                </button>
            </PreRack>

            <Rack actions={actions} selected={selectedForSwap} setSelected={setSelectedForSwap}/>

            {actions.isMyTurn &&
                <button
                    onClick={doEnableSwap}
                >
                    Swap
                </button>}

        </StyledRackAndControls>
        );
    }
}
