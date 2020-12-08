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

// const DummyComponent = () => {
//     return <div>Hello from DummyComponent</div>
// } 
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
            <GameControl boardControl={boardControl} displayOptions={displayOptions} />
        </div>
    );



    const dummyGame = {
        name: 'dummyGame',

        setup: () => ({ cells: Array(9).fill(null) }),
      
        moves: {
          clickCell: (G: any, ctx: any, id: number) => {
            G.cells[id] = ctx.currentPlayer;
          },
        },
      };

    const options ={
        game: dummyGame,
        board: board,
    };

    const Bg = BgioClient(options);

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return (
        <DndProvider backend={HTML5Backend}>
            <Bg/>
        </DndProvider>
    );
}

export default Game;
