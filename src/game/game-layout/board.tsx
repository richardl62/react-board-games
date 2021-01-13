import React, { ReactElement } from 'react';
import BoardSquare  from './board-square';
import ControlledSquare  from '../game-control/controlled-square';
import GameControl from '../game-control/game-control';

import { nonNull } from './../../tools';
import styles from './game-layout.module.css';
import { PiecePosition } from '../../interfaces';

const boardBorder = nonNull(styles.boardBorder);
const boarderLetter = nonNull(styles.boarderLetter);
const boarderNumber = nonNull(styles.boarderNumber);

type Elems = Array<ReactElement>;

function addHeader(nCols: number, elems: Elems, rowName: string) {
    const key = (elemName: string | number) => rowName + '-' + elemName;
    elems.push(<div key={key('start')} />);
    for (let col = 0; col < nCols; ++col) {
        elems.push(
            <div
                key={key(col)}
                className={`${boardBorder} ${boarderLetter}`}
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
    const borderLabels = gameControl.boardStyle.labels;

    const key = (name: string | number) =>  'r' + row + '-' + name;

    let makeBoarderElem = (name: string) => (
        <div
            key={key(name)}
            className={`${boardBorder} ${boarderNumber}`}
        >
            {nRows - row}
        </div>
    );

    let makeSquare = (col: number) => {
        const pos = new PiecePosition({row:row, col:col});
        return (
            <BoardSquare
                key={key(col)}
                
                squareProperties={gameControl.squareProperties(pos)}
            >
                <ControlledSquare gameControl={gameControl} pos={pos} />
            </BoardSquare>
        );
    };

    if(borderLabels) {
        elems.push(makeBoarderElem('start'));
    }

    for (let col = 0; col < nCols; ++col) {
        elems.push(makeSquare(col));
    }

    if(borderLabels) {
        elems.push(makeBoarderElem('end'));
    }
}


function Board({ gameControl }: {
    gameControl: GameControl
    })
    {
    const nRows = gameControl.nRows;
    const nCols = gameControl.nCols;
    const borderLabels = gameControl.boardStyle.labels;

    let elems: Elems = [];

    if(borderLabels) {
        addHeader(nCols, elems, 'top');
    }
    for (let row = 0; row < nRows; ++row) {
        const rowToAdd = gameControl.reverseBoardRows ? nRows - 1 - row : row;
        addRow(rowToAdd, gameControl, elems);
    }

    if(borderLabels) {
        addHeader(nCols, elems, 'bottom');
    }

    const nGridCols = nCols + (borderLabels ? 2 : 0);
    const nGridRows = nRows + (borderLabels ? 2 : 0);
    const style = { // For now
        display: 'grid',
        gridTemplateColumns: `repeat(${nGridCols},auto)`,
        gridTemplateRows: `repeat(${nGridRows},auto)`,
    };

    return (
        <div className={nonNull(styles.board)} style={style}>
            {elems}
        </div>
    )

}

export default Board;
