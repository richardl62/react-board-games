import React from 'react';

import { SimpleSquare } from './square'
import { CorePiece } from './core-piece';
import { Piece } from './piece';
import { BoardControl }  from './board-control';

function RowOfPieces({ corePieces, boardControl }: {
    corePieces: Array<CorePiece>,
    boardControl: BoardControl,
}) {
    return (
        <div className='row-of-pieces'>
            {corePieces.map(
                (cp, index) => (
                    <SimpleSquare key={index}>
                        { <Piece corePiece={cp} boardControl={boardControl} /> }
                    </SimpleSquare>
                )
            )}
        </div>
    );
}

export { RowOfPieces }