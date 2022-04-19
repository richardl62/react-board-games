import React from "react";
import styled from "styled-components";
import { Letter } from "../config";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { Square } from "./square";

// KLUDGE? Use Grid rather than flex to allow a gap to be specified
const Grid = styled.div<{nCols: number}>`
    display: inline-grid;
    grid-template-columns: repeat(${props => props.nCols}, auto);
    background-color: ${boardBoarderColor};
    grid-gap: ${boardBoarderSize.internal};
    padding: ${boardBoarderSize.external}};
`;

interface TileGridProps {
    letters: (Letter | null) [] | (Letter | null) [][];
    name: string;
}

export function TileGrid(props: TileGridProps) : JSX.Element {
    const { letters } = props;

    const nCols = Array.isArray(letters[0]) ? letters[0].length : letters.length;

    return <Grid nCols={nCols}>
        {letters.flat().map((letter, index) =>
            <Square key={index} letter={letter} />
        )}
    </Grid>;
}