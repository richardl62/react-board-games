import React, { ReactElement } from 'react';
import ControlledSquare from './square';
import { GameControl } from '../control';
import styled from 'styled-components';

interface BoardStyledProps {
    nGridCols: number;
    nGridRows: number;
}

const BoardStyled = styled.div<BoardStyledProps>`        
    display: inline-grid;
    background-color: var(--board-background);
    grid-template-columns: ${props => `repeat(${props.nGridCols},auto)`};
    grid-template-rows: ${props => `repeat(${props.nGridRows},auto)`};
`; 

const BoardBorder = styled.div`
    color:white;
`
const BorderLetter = styled(BoardBorder)`
    font-size: 20px;
    padding: 3px 0;
`
const BorderNumber = styled(BoardBorder)`
    font-size: 25px;
    padding: 0 7px;
`

type Elems = Array<ReactElement>;

function addHeader(nCols: number, elems: Elems, rowName: string) {
    const key = (elemName: string | number) => rowName + '-' + elemName;
    elems.push(<div key={key('start')} />);
    for (let col = 0; col < nCols; ++col) {
        elems.push(
            <BorderLetter key={key(col)}>
                {String.fromCharCode(65 + col)}
            </BorderLetter>
        );
    }
    elems.push(<div key={key('end')} />);
}

function addRow(row: number, gameControl: GameControl, elems: Elems) {

    const nRows = gameControl.nRows;
    const nCols = gameControl.nCols;
    const borderLabels = gameControl.boardStyle.labels;

    const key = (name: string | number) => 'r' + row + '-' + name;

    let makeBoarderElem = (name: string) => (
        <BorderNumber key={key(name)}>
            {nRows - row}
        </BorderNumber>
    );

    let makeSquare = (col: number) => {
        const pos = { row: row, col: col };
        return <ControlledSquare key={key(col)} gameControl={gameControl} pos={pos} />
    };

    if (borderLabels) {
        elems.push(makeBoarderElem('start'));
    }

    for (let col = 0; col < nCols; ++col) {
        elems.push(makeSquare(col));
    }

    if (borderLabels) {
        elems.push(makeBoarderElem('end'));
    }
}

function Board({ gameControl }: {
    gameControl: GameControl
}) {
    const nRows = gameControl.nRows;
    const nCols = gameControl.nCols;
    const borderLabels = gameControl.boardStyle.labels;

    let elems: Elems = [];

    if (borderLabels) {
        addHeader(nCols, elems, 'top');
    }
    for (let row = 0; row < nRows; ++row) {
        const rowToAdd = gameControl.reverseBoardRows ? nRows - 1 - row : row;
        addRow(rowToAdd, gameControl, elems);
    }

    if (borderLabels) {
        addHeader(nCols, elems, 'bottom');
    }

    const nGridCols = nCols + (borderLabels ? 2 : 0);
    const nGridRows = nRows + (borderLabels ? 2 : 0);
    return <BoardStyled nGridRows={nGridRows} nGridCols={nGridCols}> {elems} </BoardStyled>;
}

export default Board;
