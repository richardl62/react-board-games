import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import GameControl from './game-control';

import { useBoardControl } from './board-control'
import { useDisplayOptions } from './display-options';
import { GameProps } from './game-interfaces';
import { Client as BgioClient } from 'boardgame.io/react';

import './index.css';

const DummyComponent = () => {
    return <div>Hello from DummyComponent</div>
} 
const Game : React.FC<GameProps> = (props: GameProps) => {
    
    const boardControl = useBoardControl(props); 
    const displayOptions = useDisplayOptions();

    let copyablePieces = (which : 'top' | 'bottom') => {
        let top = which === 'top';
        if(displayOptions.reverseBoardRows) {
            top = !top;
        }

        return top ? boardControl.copyablePiecesTop : boardControl.copyablePiecesBottom;
    }

    const board = () => (
        // sbg -> Simple Board Game
        <div className="sbg"> 
             <DndProvider backend={HTML5Backend}>
                <div className="sbg__game">

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


    const TicTacToe = {
        name: 'tic-tac-toe',

        setup: () => ({ cells: Array(9).fill(null) }),
      
        moves: {
          clickCell: (G: any, ctx: any, id: number) => {
            G.cells[id] = ctx.currentPlayer;
          },
        },
      };

    const options ={
        game: TicTacToe,
        board: board,
    };

    return BgioClient(options);
}

export default Game;
