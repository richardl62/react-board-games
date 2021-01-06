import React from 'react';

import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control/game-control';

import { nonNull } from './../../tools';
import styles from './game.module.css';


function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {

    const corePieces = gameControl.offBoardPieces(where);
    return (
        <div className={nonNull(styles.rowOfPieces)}>
            {corePieces.map(
                (cp, index) => (
                    <div key={index}  className={nonNull(styles.square)} >
                        { <Piece corePiece={cp} gameControl={gameControl} /> }
                    </div>
                )
            )}
        </div>
    );
}

export default RowOfPieces;