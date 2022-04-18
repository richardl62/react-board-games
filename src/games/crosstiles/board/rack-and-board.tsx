import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { TileGrid } from "./tile-grid";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    align-items: start;
    > * {
        margin-bottom: 10px;
    }    
`;

export function RackAndBoard() : JSX.Element | null {
    const context = useCrossTilesContext();

    const { rack, grid: board } = context;
    sAssert(rack);

    return <OuterDiv>
        <TileGrid letters={rack} />
        <TileGrid letters={board} />
    </OuterDiv>;
}