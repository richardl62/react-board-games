import React from 'react';
import { GameControl } from '../game-creation';
import { nonNull } from '../tools';
import styles from './game-layout.module.css';

function UserOptions({ gameControl }: { gameControl: GameControl; }) {

    return (
        <div className={nonNull(styles.userOptions)}>

            <div className={nonNull(styles.userOptionsButtons)}>
                <button type='button' onClick={() => gameControl.restart()}>
                    Restart
                </button>
            </div>

            <div className={nonNull(styles.userOptionsButtons)}>
                <button type='button' 
                    disabled={!gameControl.canUndo} 
                    onClick={() => gameControl.undo()}
                >
                    Undo
                </button>

                <button type='button'
                    disabled={!gameControl.canRedo} 
                    onClick={() => gameControl.redo()}
                >
                    Redo
                </button>
            </div>

            <div className={nonNull(styles.userOptionsButtons)}>
                <button type='button' onClick={() => gameControl.flipRowOrder()}>
                    Flip
                </button>
            </div>
        </div>
    );
}

export default UserOptions;