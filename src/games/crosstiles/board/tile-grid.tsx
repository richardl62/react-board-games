import React from "react";
import styled from "styled-components";
import { Letter } from "../config";
import { boardBoarderColor, boardBoarderSize } from "./style";
import { Square } from "./square";
import { sAssert } from "../../../utils/assert";
import { ClickMoveStart, SquareID } from "../client-side/actions/types";


function squareID(row: number, col: number, container: Container) : SquareID {
    if (container === "grid") {
        return {row, col, container};
    } else {
        sAssert(row === 0);
        return {col, container};
    }
}

// KLUDGE? Use Grid rather than flex to allow a gap to be specified
const Grid = styled.div<{nCols: number}>`
    display: inline-grid;
    grid-template-columns: repeat(${props => props.nCols}, auto);
    background-color: ${boardBoarderColor};
    grid-gap: ${boardBoarderSize.internal};
    padding: ${boardBoarderSize.external}};
`;

type Container = SquareID["container"];
interface TileGridProps {
    letters: (Letter | null) [][];
    
    /** Use as part of the drag/drop ID. If omiited drag and drop is disabled. */
    container?: Container;
    clickMoveStart?: ClickMoveStart | null;
}

export function TileGrid(props: TileGridProps) : JSX.Element {
    const { letters, container, clickMoveStart } = props;

    const nRows = letters.length;
    const nCols = letters[0].length;

    const squares = [];
    for(let row = 0; row < nRows; ++row) {
        sAssert(letters[row].length === nCols, "Grid of tiles in not rectangular");
        for(let col = 0; col < nCols; ++col) {
            const id = container && squareID(row, col, container);
            
            let clickMoveDirection;
            if(clickMoveStart && clickMoveStart.row === row && clickMoveStart.col === col) {
                clickMoveDirection = clickMoveStart.direction;
            }

            squares.push(<Square 
                key={`${row}-${col}`} 
                letter={letters[row][col]}
                id={id}
                clickMoveDirection={clickMoveDirection} 
            />);
        }
    }

    return <Grid nCols={nCols}>
        {squares}
    </Grid>;
}