import React from 'react';

//import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control/game-control';
import ControlledSquare from '../game-control/controlled-square'
import { nonNull } from './../../tools';
import styles from './game-layout.module.css';
import { PiecePosition } from '../../interfaces';


function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {
    const offBoard = gameControl.offBoardPieces(where);
    return (
        // Kludge? Use outer div to control the size (via class 'square')
        <div className={nonNull(styles.rowOfPieces)}>
            {offBoard.map((_dummy, index) => {
                const pos = new PiecePosition({[where]: index});

                return (<ControlledSquare key={index} gameControl={gameControl} pos={pos} />);
            }
            )}
        </div>
    );
}

export default RowOfPieces;
