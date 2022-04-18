import React from "react";
import styled from "styled-components";
import { Letter } from "../config";
import { boardBoarderColor, boardBoarderSize, squareBackgroundColor, squareSize } from "./style";
import { Tile } from "./tile";

const EmptySquare = styled.div`
    height: ${squareSize};
    width: ${squareSize};

    background-color: ${squareBackgroundColor};
`;


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
}

export function TileGrid(props: TileGridProps) : JSX.Element {
    const { letters } = props;

    const nCols = Array.isArray(letters[0]) ? letters[0].length : letters.length;

    return <Grid nCols={nCols}>
        {letters.flat().map((letter, index) =>
            letter ?
                <Tile key={index} letter={letter} /> :
                <EmptySquare key={index} />
        )}
    </Grid>;
}