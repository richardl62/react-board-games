import React from "react";
import styled from "styled-components";
import { Letter } from "../config";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { Tile } from "./tile";

// KLUDGE? Use Grid rather than flex to allow a gap to be specified
const Grid = styled.div<{ncols: number}>`
    display: inline-grid;
    grid-template-columns: repeat(${props => props.ncols}, auto);
    background-color: ${boardBoarderColor};
    grid-gap: ${boardBoarderSize.internal};
    padding: ${boardBoarderSize.external}};
`;

interface RackProps {
    letters: (Letter | null) [];
}

export function Rack(props: RackProps) : JSX.Element {
    const { letters } = props;

    return <Grid ncols={letters.length}>
        {letters.map((letter, index) => <Tile key={index} letter={letter} />)}
    </Grid>; 
}