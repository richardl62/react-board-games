import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import GameControl from './game-control';

import { useBoardControl } from './board-control'
import { useDisplayOptions } from './display-options';

import './chess.css';

const Game : React.FC = () => {
    
    const boardControl = useBoardControl(); 
    const displayOptions = useDisplayOptions();

    let copyablePieces = (which : 'top' | 'bottom') => {
        let top = which === 'top';
        if(displayOptions.reverseBoardRows) {
            top = !top;
        }

        return top ? boardControl.copyablePiecesTop : boardControl.copyablePiecesBottom;
    }

    return (
        <div className="chess">
            <DndProvider backend={HTML5Backend}>
                <div className="chess__game">

                    <RowOfPieces
                        corePieces={copyablePieces('top')}
                        boardControl={boardControl}
                    />

                    <Board
                        boardControl={boardControl}
                        displayOptions={displayOptions}
                    />

                    <RowOfPieces
                        corePieces={copyablePieces('bottom')}
                        boardControl={boardControl}
                    />
                </div>
            </DndProvider>
            <GameControl boardControl={boardControl} displayOptions={displayOptions} />
        </div>
    );
}

export { Game }