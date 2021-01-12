import React from 'react';

//import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control/game-control';
import { ControlledPiece} from '../game-control/controlled-square'
import { nonNull } from './../../tools';
import styles from './game-layout.module.css';


function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {
    const corePieces = gameControl.offBoardPieces(where);
    return (
        // Kludge? Use outer div to control the size (via class 'square')
        <div className={nonNull(styles.rowOfPieces)}>
            {corePieces.map((piece, index) =>
                <div key={index} className={nonNull(styles.square)}>
                    <ControlledPiece piece={piece} gameControl={gameControl} />
                </div> 
            )}
        </div>
    );
}

export default RowOfPieces;
