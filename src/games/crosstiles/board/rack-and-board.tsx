import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { TileGrid } from "./tile-grid";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    > * {
        margin-bottom: 10px;
    }    
`;

const RackDiv = styled.div`
    > * {
        margin-right: 0.3em;
    }
`;

export function RackAndBoard() : JSX.Element | null {
    const context = useCrossTilesContext();

    const { rack, grid: board, clickMoveStart, dispatch } = context;
    sAssert(rack);

    return <OuterDiv>
        <DndProvider backend={HTML5Backend}>
            <RackDiv>
                <TileGrid letters={[rack]} container="rack" />
                <button onClick={()=>dispatch({type: "recallToRack"})}>Recall</button>
                <button onClick={()=>dispatch({type: "shuffleRack"})}>Shuffle</button>
            </RackDiv>
            <TileGrid letters={board} container="grid" clickMoveStart={clickMoveStart}/>
        </DndProvider>
    </OuterDiv>;
}