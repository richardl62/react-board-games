import React from 'react';

import { SimpleSquare } from './square'
import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control/game-control';

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

export default RowOfPieces;