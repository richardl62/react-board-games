import React from 'react';
import { GameControl } from './game-control';
import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';

function UserOptions({ gameControl } : {gameControl: GameControl}) {

    return (
        <div className="sbg__game-control">

            <div className='sbg__buttons'>
                <button type='button' onClick={() => gameControl.clearAll()}> Clear</button>
                <button type='button' onClick={() => gameControl.flipRowOrder()}>Flip</button>
            </div>

            <div className='sbg__buttons'>
                <button type='button'
                    onClick={() => gameControl.undo()}>
                    Undo
                </button>

                <button type='button'
                    onClick={() => gameControl.redo()}>
                                   Redo
                </button>

                <button type='button'
                    onClick={() => gameControl.restart()}>
                             Restart
                </button>
            </div>
        </div>
    );
}

function SimpleGame({gameControl} : {gameControl: GameControl})
{
    return (
        // sbg -> Simple Board Game
        <div className="sbg">
            <div className="sbg__game">
                <RowOfPieces where='top' gameControl={gameControl} />

                <Board gameControl={gameControl} />

                <RowOfPieces where='bottom' gameControl={gameControl} />
            </div>
            <UserOptions gameControl={gameControl} />
        </div>
    );
}

export default SimpleGame;
