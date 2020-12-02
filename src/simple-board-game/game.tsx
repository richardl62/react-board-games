import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import GameControl from './game-control';

import { useBoardControl } from './board-control'
import { useDisplayOptions } from './display-options';

import './index.css';

type StyleName = 'checkered';
const checkered: StyleName = 'checkered';

interface Copyable {
    top: Array<string>;
    bottom: Array<string>;
}

interface GameLayout {
        copyable: Copyable | null;

        board: Array<Array<string|null>>;
        makePiece: (arg0: string) => JSX.Element;

        style: StyleName | null;  // For now
    };

interface GameProps {
    options: GameLayout;
}
const Game : React.FC<GameProps> = ({options}: GameProps) => {
    
    const boardControl = useBoardControl(options); 
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

export { Game, checkered };
export type { GameLayout };