import React from 'react';
import { colors } from "../colors";
import styled from 'styled-components';
import { deepArrayMap, deepCopyArray } from '../../shared/tools';


const Corner = styled.div<{width: string}>`
    width: ${props => props.width};
    height: ${props => props.width};
`

const BorderElement = styled.div<{borderWidth: string}>`
    color: white;
    font-family: 'Helvetica'; // No special reason
    font-size: borderWidth;
    font-weight: bold;

    text-justify: center;
    margin: auto;
`;

const RectangularBoard = styled.div<{
    nCols: number, 
    gridGap: string,
    borderWidth: string,
    }>`        
    display: inline-grid;
    background-color: ${colors.boardBackground};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
    
    grid-gap: ${props => props.gridGap};
    border: ${props => props.borderWidth} solid ${colors.boardBackground};
`; 


function rowCol(array: Array<Array<any>>) {
    return {
        nRows: array.length,
        nCols: array[0].length,
    }
}

interface BoardProps {
    squares: Array<Array<JSX.Element>>;
    borderLabels: boolean;
    reverseRows: boolean;

    gridGap: string;
    borderWidth: string;
}

export function Board({ squares, borderLabels, reverseRows, gridGap, borderWidth }: BoardProps) {
    const { nRows, nCols } = rowCol(squares);

    // elems will include border elements and squares.
    let elems: Array<Array<JSX.Element>> = deepCopyArray(squares);
    
    const borderElement = (label:string|number) => {
        return <BorderElement borderWidth={borderWidth}>{label}</BorderElement>;
    }

    if(borderLabels) {
        // Add side labels.
        for (let row = 0; row < nRows; ++row) {
            elems[row].unshift(borderElement(row));
            elems[row].push(borderElement(row));
        }
    }

    if(reverseRows) {
        elems.reverse();
    }

    if (borderLabels) {
        // Add top/bottom rows
        const topBottom = () => {
            let elems = [];
            for (let col = 0; col < nCols; ++col) {
                const label = String.fromCharCode(65 + col);
                elems[col] = borderElement(label);
            }
            elems.unshift(<Corner width={borderWidth}></Corner>)
            elems.push(<Corner width={borderWidth}></Corner>)

            return elems;
        }
        elems.unshift(topBottom())
        elems.push(topBottom())
    }

    //KLUDGE
    const elemsWithKeys = deepArrayMap(elems, 
        (elem: JSX.Element, indices: Array<number>) => {
            const key = JSON.stringify(indices);
            return <div key={key}>{elem}</div>;
        }
    );

    return (
        <RectangularBoard
            nCols={elems[0].length}
            gridGap={gridGap}
            borderWidth={borderLabels ? '0' : borderWidth}
        >
            {elemsWithKeys}
        </RectangularBoard>
    );
}
