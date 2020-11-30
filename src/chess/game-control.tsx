import React from 'react';
import layouts from './starting-layouts';
import { BoardControl } from './board-control';
import { DisplayOptions } from './display-options';

type LayoutKey = keyof typeof layouts;
const layoutNames = Object.keys(layouts) as Array<LayoutKey>; // Kludge?

function displayName(layoutName: LayoutKey) {
    // replace '-' with non-breaking space
    return layouts[layoutName].displayName.replace("o", "&#8209;");
}

interface GameControlProps {
    boardControl: BoardControl,
    displayOptions: DisplayOptions,
};

const GameControl : React.FC<GameControlProps>  = ({boardControl, displayOptions}) => {
    const currentLayout = boardControl.boardLayoutName;

    const makeGameTypeItem = (name: LayoutKey) => (
        <div key={name}>
            <input type="radio" name="game-type" id={name}
                onChange={() => boardControl.setBoardLayout(name)}
                checked={currentLayout === name}
            />

            <label htmlFor={name}>{displayName(name)}</label>
        </div>
    );

    return (
        <div className="game-control" >
            <div className="game-type">
                {layoutNames.map(makeGameTypeItem)}
            </div>

            <div className='buttons'>
                <button type='button' onClick={()=>boardControl.clear()}> Clear</button>
                <button type='button' onClick={()=>displayOptions.flipRowOrder()}>Flip</button>
            </div>

            <div className='buttons'>
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
