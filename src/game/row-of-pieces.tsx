import React from 'react';

import { SimpleSquare } from './square'
import { Piece } from '../simple-board-game/controlled-piece';
import { GameControl }  from '../simple-board-game/game-control';

function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {

    const corePieces = gameControl.offBoardPieces(where);
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