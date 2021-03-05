import React from 'react';
import { GameControl } from '../control';
import { nonNull } from '../../tools';
import styles from './game-layout.module.css';
import { lobbyPath } from '../../url-tools';

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
            
            <div>
                <a href={lobbyPath(gameControl.name)}>Lobby (for online play)</a>
            </div>
        </div>
    );
}

export default UserOptions;