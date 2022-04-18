import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { RackAndBoard } from "./rack-and-board";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    > * {
        margin-bottom: 10px;
    }    
`;

export function MakeGrid() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, rack, grid: board } = context;
    const { moves } = context.wrappedGameProps;

    if(stage !== GameStage.makingGrids) {
        return null;
    }
    sAssert(rack);

    return <OuterDiv>
        <RackAndBoard />

        <button onClick={() => moves.recordGrid(board)}>Record Grid</button>
    </OuterDiv>;
}