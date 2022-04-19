import React from "react";
import styled from "styled-components";
import { Letter } from "../config";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { Square } from "./square";
import { sAssert } from "../../../utils/assert";

// KLUDGE? Use Grid rather than flex to allow a gap to be specified
const Grid = styled.div<{nCols: number}>`
    display: inline-grid;
    grid-template-columns: repeat(${props => props.nCols}, auto);
    background-color: ${boardBoarderColor};
    grid-gap: ${boardBoarderSize.internal};
    padding: ${boardBoarderSize.external}};
`;

interface TileGridProps {
    letters: (Letter | null) [][];
    name: string;
}

export function TileGrid(props: TileGridProps) : JSX.Element {
    const { letters, name } = props;

    const nRows = letters.length;
    const nCols = letters[0].length;

    const squares = [];
    for(let row = 0; row < nRows; ++row) {
        sAssert(letters[row].length === nCols, "Grid of tiles in not rectangular");
        for(let col = 0; col < nCols; ++col) {
            const id = { row, col, gridName: name };
            squares.push(<Square 
                key={`${row}-${col}`} 
                letter={letters[row][col]}
                id={id} 
            />);
        }
    }

    return <Grid nCols={nCols}>
        {squares}
    </Grid>;
}