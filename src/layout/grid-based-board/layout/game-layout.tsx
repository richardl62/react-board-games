import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { nonNull } from '../../../shared/tools';
import { GameControl } from '../control';
import Board from './board';
import styles from './game-layout.module.css';
import RowOfPieces from './row-of-pieces';
import UserOptions from './user-options';

function Header({ gameControl }: { gameControl: GameControl }) {
    const {playerNames, caller } = gameControl.players;
    const nPlayers = playerNames.length;
    let message;
    if( gameControl.gameover ) {
        message = 'Game over';
        if(nPlayers > 1) {
            const winner = gameControl.gameover.winner;
            const name = (winner === caller) ? "You" : playerNames[winner];
            message += `: ${name} won`;
        }
    } else if(gameControl.moveDescription) {
        message = gameControl.moveDescription;
    }
    return (<div className={nonNull(styles.message)}>{message}</div>);
}

function Game({ gameControl }: { gameControl: GameControl }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={nonNull(styles.game)}>
                <div className={nonNull(styles.playingArea)}>
                    <Header gameControl={gameControl} />
                    <div>
                        <RowOfPieces where='top' gameControl={gameControl} />

                        <Board gameControl={gameControl} />

                        <RowOfPieces where='bottom' gameControl={gameControl} />
                    </div>
                </div>
                <UserOptions gameControl={gameControl} />
            </div>
        </DndProvider>
    );
}

export default Game;
