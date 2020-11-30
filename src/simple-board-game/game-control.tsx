import React from 'react';
import { BoardControl } from './board-control';
import { DisplayOptions } from './display-options';

interface GameControlProps {
    boardControl: BoardControl,
    displayOptions: DisplayOptions,
};

const GameControl : React.FC<GameControlProps>  = ({boardControl, displayOptions}) => {

    return (
        <div className="chess__game-control" >

            <div className='chess__buttons'>
                <button type='button' onClick={()=>boardControl.clear()}> Clear</button>
                <button type='button' onClick={()=>displayOptions.flipRowOrder()}>Flip</button>
            </div>

            <div className='chess__buttons'>
                <button type='button'
                    disabled={!boardControl.canUndo}
                    onClick={() => boardControl.undo()}>
                    Undo
                </button>

                <button type='button'
                    disabled={!boardControl.canRedo}
                    onClick={() => boardControl.redo()}>
                    Redo
                </button>

                <button type='button'
                    disabled={!boardControl.canUndo} //Kludge? 
                    onClick={()=>boardControl.restart()}>
                    Restart
                </button>
            </div>
        </div>
    );
}


export default GameControl;
