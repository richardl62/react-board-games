import React from 'react';
import { GameControl } from './game-control';
import { DisplayOptions } from './display-options';

interface UserOptionsProps {
    gameControl: GameControl,
    displayOptions: DisplayOptions,
};

const UserOptions : React.FC<UserOptionsProps>  = ({gameControl, displayOptions}) => {

    return (
        <div className="sbg__game-control" >

            <div className='sbg__buttons'>
                <button type='button' onClick={()=>gameControl.clear()}> Clear</button>
                <button type='button' onClick={()=>displayOptions.flipRowOrder()}>Flip</button>
            </div>

            <div className='sbg__buttons'>
                <button type='button'
                    disabled={!gameControl.canUndo}
                    onClick={() => gameControl.undo()}>
                    Undo
                </button>

                <button type='button'
                    disabled={!gameControl.canRedo}
                    onClick={() => gameControl.redo()}>
                    Redo
                </button>

                <button type='button'
                    disabled={!gameControl.canUndo} //Kludge? 
                    onClick={()=>gameControl.restart()}>
                    Restart
                </button>
            </div>
        </div>
    );
}


export default UserOptions;
