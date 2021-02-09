import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameControl from '../game-control/game-control';
import Board from './board';
import RowOfPieces from './row-of-pieces';
import { nonNull } from './../../tools';
import styles from './game-layout.module.css';
import UserOptions from './user-options';

// const nameElements = playerNames.map((name: string, index: number) => {
//     let props : any = {};
//     if(index === active) {
//         props.className = nonNull(styles.currentPlayer);
//     }
//     return (<div key={index} {...props}>{name}</div>);
// })


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
            message = `Waiting for ${playerNames[active]}`;
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
