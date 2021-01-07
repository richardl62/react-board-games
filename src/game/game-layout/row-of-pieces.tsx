import React from 'react';

//import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control/game-control';
import { ControlledPiece} from '../game-layout/controlled-square'
import { nonNull } from './../../tools';
import styles from './game.module.css';


function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {

    const corePieces = gameControl.offBoardPieces(where);
    return (
        <div className={nonNull(styles.rowOfPieces)}>
            {corePieces.map((cp, index) =>
              <ControlledPiece corePiece={cp} gameControl={gameControl} /> 
            )}
        </div>
    );
}

export default RowOfPieces;