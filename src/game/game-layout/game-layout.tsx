import React from 'react';
import GameControl from '../game-control/game-control';
import Board from './board';
import RowOfPieces from './row-of-pieces';
import { nonNull } from './../../tools';
import styles from './game-layout.module.css';
import UserOptions from './user-options';

function Game({ gameControl }: { gameControl: GameControl }) {
    return (
        // sbg -> Simple Board Game
        <div className={nonNull(styles.playingArea)}>
            <div>
                <RowOfPieces where='top' gameControl={gameControl} />

                <Board gameControl={gameControl} />

                <RowOfPieces where='bottom' gameControl={gameControl} />
            </div>
            <UserOptions gameControl={gameControl} />
        </div>
    );
}

export default Game;
