import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { TileGrid } from "./tile-grid";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;  
`;

const RackDiv = styled.div`
    > * {
        margin-right: 0.3em;
    }
    margin-bottom: 10px;
`;

export function RackAndBoard() : JSX.Element | null {
    const context = useCrossTilesContext();

    const { rack, grid: board, clickMoveStart, dispatch,
        playerData, wrappedGameProps: { playerID }  } = context;

    const { doneRecordingGrid } = playerData[playerID];

    sAssert(rack);

    if (doneRecordingGrid) {
        return <OuterDiv>
            <RackDiv>
                <TileGrid letters={[rack]} />
            </RackDiv>
            <TileGrid letters={board} />
        </OuterDiv>;
    }

    return <OuterDiv>
        <RackDiv>
            <TileGrid letters={[rack]} container="rack" />
            <button onClick={() => dispatch({ type: "recallToRack" })}>Recall</button>
            <button onClick={() => dispatch({ type: "shuffleRack" })}>Shuffle</button>
        </RackDiv>
        <TileGrid letters={board} container="grid" clickMoveStart={clickMoveStart} />
    </OuterDiv>;
}