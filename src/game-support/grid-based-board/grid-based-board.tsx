import React from 'react';
import { BorderLetter, BorderNumber, RectangularBoard, colors, GridSquareBackground, GridSquareElement } from './styles';

function rowCol(array: Array<Array<any>>) {
    return {
        nRows: array.length,
        nCols: array[0].length,
    }
}

function squareColor(row: number, col: number, checkered: boolean) {
    if (!checkered) {
        return colors.whiteSquare;
    }

    const asTopLeft = (row + col) % 2 === 0;
    return asTopLeft ? colors.whiteSquare : colors.blackSquare;
}

interface BoardGridProps {
    squares: Array<Array<JSX.Element>>;
    borderLabels: boolean;
    checkered: boolean;
    /** Reverse the order of the rows */
    flip: boolean;
}

export function BoardGrid({ squares, borderLabels, checkered, flip }: BoardGridProps) {
    const { nRows, nCols } = rowCol(squares);

    let elemRows: Array<Array<JSX.Element>> = [];

    for (let row = 0; row < nRows; ++row) {

        let elems = [];
        for (let col = 0; col < nCols; ++col) {
            elems.push(
                <GridSquareBackground key={`${row}:${col}`} color={squareColor(row, col, checkered)} >
                    <GridSquareElement> {squares[row][col]} </GridSquareElement>
                </GridSquareBackground>
            );
        }

        if (borderLabels) {
            const labelValue = nRows - row;
            elems.unshift(<BorderNumber key={`${row}start`}> {labelValue} </BorderNumber>);
            elems.push(<BorderNumber key={`${row}end`}> {labelValue} </BorderNumber>);
        }
        elemRows.push(elems);
    }

    if (flip) {
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
            internalBorders={!checkered}
        >
            {elemRows}
        </RectangularBoard>
    );
}
