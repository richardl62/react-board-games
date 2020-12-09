import React from 'react';

import { SimpleSquare } from './square'
import { CorePiece } from './core-piece';
import { Piece } from './piece';
import { GameControl }  from './game-control';

function RowOfPieces({ corePieces, gameControl }: {
    corePieces: Array<CorePiece>,
    gameControl: GameControl,
}) {
    return (
        <div className='sbg__row-of-pieces'>
            {corePieces.map(
                (cp, index) => (
                    <SimpleSquare key={index}>
                        { <Piece corePiece={cp} gameControl={gameControl} /> }
                    </SimpleSquare>
                )
            )}
        </div>
    );
}

export { RowOfPieces }