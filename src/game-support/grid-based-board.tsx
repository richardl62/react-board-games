import React from 'react';
import { BorderLetter, BorderNumber, RectangularBoard } from './styles';

function rowCol(array: Array<Array<any>>) {
    return {
        nRows: array.length,
        nCols: array[0].length,
    }
}

function makeHeaderElems(nCols: number, rowName: string) : Array<JSX.Element>{
    const key = (elemName: string | number) => {return {key: rowName + '-' + elemName}};
    
    let elems = [];

    elems.push(<div {...key('start')} />);
    for (let col = 0; col < nCols; ++col) {
        elems.push(
            <BorderLetter {...key(col)}>
                {String.fromCharCode(65 + col)}
            </BorderLetter>
        );
    }
    elems.push(<div {...key('end')} />);

    return elems;
}

function makeRowElems(
    row: number, 
    squares: Array<Array<JSX.Element>>, 
    bordedLabels: boolean) : Array<JSX.Element> {

    const {nRows, nCols} = rowCol(squares);
    const key = (name: string | number) => {return {key: 'r' + row + '-' + name}};
    const labelValue = nRows - row;

    const elems = [];
    if (bordedLabels) {
        elems.push(<BorderNumber {...key('start')}> {labelValue} </BorderNumber>);
    }

    for (let col = 0; col < nCols; ++col) {
        elems.push(squares[row][col]);
    }

    if (bordedLabels) {
        elems.push(<BorderNumber {...key('end')}> {labelValue} </BorderNumber>);
    }

    return elems;
}

interface BoardGridProps {
    squares: Array<Array<JSX.Element>>;
    borderLabels: boolean;
    //To do: Add display properties (e.g. 'checkered');
}

export function BoardGrid({ squares, borderLabels }: BoardGridProps) {
    const {nRows, nCols} = rowCol(squares);

    let elems = [];

    if (borderLabels) {
        elems.push(makeHeaderElems(nCols, 'top'));
    }
    for (let row = 0; row < nRows; ++row) {
        //const rowToAdd = gameControl.reverseBoardRows ? nRows - 1 - row : row;
        elems.push(makeRowElems(row, squares, borderLabels));
    }

    if (borderLabels) {
        elems.push(makeHeaderElems(nCols, 'top'));
    }
    const nGridCols = borderLabels ? nCols + 2 : nCols;
    return <RectangularBoard nCols={nGridCols}> {elems} </RectangularBoard>;
}
