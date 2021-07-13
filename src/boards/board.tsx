import React, { ReactNode } from 'react';
import styled from 'styled-components';
import assert from '../shared/assert';
import { applyDefaults, isRectangular } from '../shared/tools';
import { BoardStyle, defaultColors } from "./interfaces";
import { Square, SquareProps } from './internal/square';

const Corner = styled.div<{ width: string }>`
    width: ${props => props.width};
    height: ${props => props.width};
`

const BorderElement = styled.div<{ color: string }>`
    color: ${props => props.color};
    font-family: 'Helvetica'; // No special reason
`;

const StyledGrid = styled.div<{
    nCols: number,
    gridGap: string,
    borderWidth: string,
    backgroundColor: string,
}>`        
    display: inline-grid;
    align-items: center;
    justify-items: center;

    background-color: ${props => props.backgroundColor};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
    
    grid-gap: ${props => props.gridGap};
    border: ${props => props.borderWidth} solid ${props => props.backgroundColor};
`;

function rowCol(array: Array<Array<any>>) {
    return {
        nRows: array.length,
        nCols: array[0].length,
    }
}

export interface BoardElement extends Omit<SquareProps, 'children' | 'label'> {
    piece: ReactNode;
}

export interface BoardProps extends BoardStyle {
    elements: Array<Array<BoardElement>>;
    boardID: string;
}

export function Board(props: BoardProps) {
    const defaultProps = {
        borderLabels: false,
        reverseRows: false,
        gridGap: 'none',
        borderWidth: 'none',
        colors: {
            background: defaultColors.boardBackground,
            labels: defaultColors.boardBorderLabels,
        },
    }

    const { elements: inputElems, borderLabels, reverseRows, gridGap, 
        borderWidth, colors, boardID} =
        applyDefaults(props, defaultProps);

    assert(isRectangular(inputElems), "Board array must be probably 2D");

    const { nRows, nCols } = rowCol(inputElems);

    // elems will include border elements and squares.
    let elems: Array<Array<JSX.Element>> = [];
    for (let row = 0; row < nRows; ++row) {
        elems[row] = [];
        for (let col = 0; col < nCols; ++col) {
            const sq = inputElems[row][col];
            elems[row][col] = (
                <Square 
                    key={`${row}-${col}`} 
                    label={{ row: row, col: col, boardID: boardID }} 
                    {...sq}>{sq.piece}
                </Square>
            )
        }
    }

    const borderElement = (label: string | number, keyStart: string) => {

        return <BorderElement color={colors.labels}
            key={keyStart + label}
        >{label}</BorderElement>;
    }

    if (borderLabels) {
        // Add side labels.
        for (let row = 0; row < nRows; ++row) {
            elems[row].unshift(borderElement(row, "leftMargin"));
            elems[row].push(borderElement(row, "rightMargin"));
        }
    }

    if (reverseRows) {
        elems.reverse();
    }

    if (borderLabels) {
        // Add top/bottom rows
        const makeRow = (keyStart: string) => {
            let elems = [];
            for (let col = 0; col < nCols; ++col) {
                const label = String.fromCharCode(65 + col);
                elems[col] = borderElement(label, keyStart);
            }
            elems.unshift(<Corner width={borderWidth} key={keyStart + 'left'} />)
            elems.push(<Corner width={borderWidth} key={keyStart + 'Right'} />)
            return elems;
        }
        elems.unshift(makeRow("topMargin"))
        elems.push(makeRow("bottonMargin"))
    }

    return (
        <StyledGrid
            nCols={elems[0].length}
            gridGap={gridGap}
            borderWidth={borderLabels ? '0' : borderWidth}
            backgroundColor={colors.background}
        >
            {elems}
        </StyledGrid>
    );
}

export { DragType } from './internal/square';
export type { SquareInteraction } from './internal/square';