import React, { ReactElement } from 'react';
import { DroppableSquare as BoardSquare } from './square';
import { BoardLayout } from './board-layout';
import { BoardControl } from './board-control';
import { DisplayOptions } from './display-options';

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

function addRow(layout: BoardLayout, row: number, boardControl: BoardControl, elems: Elems) {

    let key = (name: string | number) =>  'r' + row + '-' + name;

    let makeBoarderElem = (name: string) => (
        <div
            key={key(name)}
            className='sbg__board-border sbg__board-border-number'
        >
            {layout.nRows - row}
        </div>
    );

    let makeSquare = (col: number) => {

        const squareStyle = {
            checkered: layout.checkered,
            black: layout.isBlack(row, col),
        }

        return (
            <BoardSquare
                key={key(col)}

                corePiece={layout.corePiece(row, col)}
                boardControl={boardControl}

                squareStyle={squareStyle}

                row={row}
                col={col}
            />
        );
    };

    if(boardControl.borderLabels) {
        elems.push(makeBoarderElem('start'));
    }

    for (let col = 0; col < layout.nCols; ++col) {
        elems.push(makeSquare(col));
    }

    if(boardControl.borderLabels) {
        elems.push(makeBoarderElem('end'));
    }
}


function Board({ boardControl, displayOptions }: {
    boardControl: BoardControl,
    displayOptions: DisplayOptions,
    })
    {
    const layout = boardControl.boardLayout;
    const nRows = layout.nRows;
    const nCols = layout.nCols;

    let elems: Elems = [];

    if(boardControl.borderLabels) {
        addHeader(nCols, elems, 'top');
    }
    for (let row = 0; row < nRows; ++row) {
        const rowToAdd = displayOptions.reverseBoardRows ? nRows - 1 - row : row;
        addRow(layout, rowToAdd, boardControl, elems);
    }

    if(boardControl.borderLabels) {
        addHeader(nCols, elems, 'bottom');
    }

    const nGridCols = nCols + (boardControl.borderLabels ? 2 : 0);
    const nGridRows = nRows + (boardControl.borderLabels ? 2 : 0);
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

export { Board }
