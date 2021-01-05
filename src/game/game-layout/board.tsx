import React, { ReactElement } from 'react';
import { DroppableSquare as BoardSquare } from './square';
import GameControl from '../game-control/game-control';

type Elems = Array<ReactElement>;

function addHeader(nCols: number, elems: Elems, rowName: string) {
    const key = (elemName: string | number) => rowName + '-' + elemName;
    elems.push(<div key={key('start')} />);
    for (let col = 0; col < nCols; ++col) {
        elems.push(
            <div
                key={key(col)}
                className='sbg__board-border sbg__board-border-letter'
            >
                {String.fromCharCode(65+col)}
            </div>
        );
    }
    elems.push(<div key={key('end')} />);
}

function addRow(row: number, gameControl: GameControl, elems: Elems) {

    const nRows = gameControl.nRows;
    const nCols = gameControl.nCols;

    const key = (name: string | number) =>  'r' + row + '-' + name;

    let makeBoarderElem = (name: string) => (
        <div
            key={key(name)}
            className='sbg__board-border sbg__board-border-number'
        >
            {nRows - row}
        </div>
    );

    let makeSquare = (col: number) => {
        const pos = {row: row, col: col};
        return (
            <BoardSquare
                key={key(col)}

                corePiece={gameControl.corePiece(pos)}
                gameControl={gameControl}

                squareStyle={gameControl.squareStyle(pos)}

                pos={pos}
            />
        );
    };

    if(gameControl.borderLabels) {
        elems.push(makeBoarderElem('start'));
    }

    for (let col = 0; col < nCols; ++col) {
        elems.push(makeSquare(col));
    }

    if(gameControl.borderLabels) {
        elems.push(makeBoarderElem('end'));
    }
}


function Board({ gameControl }: {
    gameControl: GameControl
    })
    {
    const nRows = gameControl.nRows;
    const nCols = gameControl.nCols;

    let elems: Elems = [];

    if(gameControl.borderLabels) {
        addHeader(nCols, elems, 'top');
    }
    for (let row = 0; row < nRows; ++row) {
        const rowToAdd = gameControl.reverseBoardRows ? nRows - 1 - row : row;
        addRow(rowToAdd, gameControl, elems);
    }

    if(gameControl.borderLabels) {
        addHeader(nCols, elems, 'bottom');
    }

    const nGridCols = nCols + (gameControl.borderLabels ? 2 : 0);
    const nGridRows = nRows + (gameControl.borderLabels ? 2 : 0);
    const style = { // For now
        display: 'grid',
        gridTemplateColumns: `repeat(${nGridCols},auto)`,
        gridTemplateRows: `repeat(${nGridRows},auto)`,
    };

    return (
        <div className="sbg__board" style={style}>
            {elems}
        </div>
    )

}

export default Board;
