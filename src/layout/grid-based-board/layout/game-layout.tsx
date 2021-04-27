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
    let message;
    if( gameControl.gameover ) {
        const winner = gameControl.gameover.winner;

        const name = (winner === caller) ? "You" : playerNames[winner];
        message = `Game over: ${name} won`;
    } else {
        const active = gameControl.activePlayer;
        if(active === caller) {
            message = "Your turn";
        } else {
            message = "Waiting for your opponent";
        }

        const description = gameControl.moveDescription;
        if (description) {
            message += ' to ' + description;
        }
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
