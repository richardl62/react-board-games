import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameControl from '../game-control/game-control';
import Board from './board';
import RowOfPieces from './row-of-pieces';
import { nonNull } from './../../tools';
import styles from './game-layout.module.css';
import UserOptions from './user-options';

function Names({ gameControl }: { gameControl: GameControl }) {
    const {playerNames, active, caller } = gameControl.players;
    return <div className={nonNull(styles.players)}>
        {playerNames.map((name, index) => {
            let props : any = {};
            if(index === active) {
                props.className = nonNull(styles.currentPlayer);
            }
            const dname = index === caller ? "You" : name;
            return (<div key={index} {...props}>{dname}</div>);
        })}
    </div>
}

function Game({ gameControl }: { gameControl: GameControl }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <div className={nonNull(styles.game)}>
                <div className={nonNull(styles.playingArea)}>
                    <Names gameControl={gameControl} />
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
