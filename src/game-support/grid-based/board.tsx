import React from 'react';
import { colors } from "../colors";
import styled from 'styled-components';

const RectangularBoard = styled.div<{nCols: number, internalBorders: boolean}>`        
    display: inline-grid;
    background-color: ${colors.boardBackground};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
    
    grid-gap: ${props => props.internalBorders ? "2px" : "none"};
    border: ${props => props.internalBorders ? 
        `10px solid ${colors.boardBackground}` : "none"};
`; 


const BorderLetter = styled.div`
    font-size: 20px;
    padding: 3px 0;
    color: ${colors.BoarderText};
    text-align: center;
`;

const BorderNumber = styled.div`
    font-size: 25px;
    padding: 0 7px;
    color: ${colors.BoarderText};
    margin: auto;
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
    internalBorders: boolean;
}

export function Board({ squares, borderLabels, reverseRows: reserveRows, internalBorders }: BoardProps) {
    const { nRows, nCols } = rowCol(squares);

    let elemRows: Array<Array<JSX.Element>> = [];

    for (let row = 0; row < nRows; ++row) {

        let elems = [];
        for (let col = 0; col < nCols; ++col) {
            elems.push(<div key={`${row}:${col}`}>{squares[row][col]}</div>);
        }

        if (borderLabels) {
            const labelValue = nRows - row;
            elems.unshift(<BorderNumber key={`${row}start`}> {labelValue} </BorderNumber>);
            elems.push(<BorderNumber key={`${row}end`}> {labelValue} </BorderNumber>);
        }
        elemRows.push(elems);
    }

    if (reserveRows) {
        elemRows.reverse();
    }

    if (borderLabels) {
        const letters = (tag: string) => {

            let elems = [<div key={tag + 'start'} />];
            for (let col = 0; col < nCols; ++col) {
                const label = String.fromCharCode(65 + col);
                elems.push(<BorderLetter key={col + label}> {label} </BorderLetter>);
            }
            elems.push(<div key={tag + 'end'} />);

            return elems;
        }

        elemRows.unshift(letters('top'));
        elemRows.push(letters('bottom'));
    }

    return (
        <RectangularBoard
            nCols={elemRows[0].length}
            internalBorders={internalBorders}
        >
            {elemRows}
        </RectangularBoard>
    );
}
