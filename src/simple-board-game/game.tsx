import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import UserOptions from './user-options';

import { GameControl, useGameControl } from './game-control'
import { useDisplayOptions } from './display-options';
import { GameProps } from './game-interfaces';
import { Client as BgioClient } from 'boardgame.io/react';

import './index.css';

interface CoreGameProps {
    gameControl: GameControl;
}
const CoreGame:  React.FC<CoreGameProps> = ({gameControl} : CoreGameProps) => {
    const displayOptions = useDisplayOptions();

    let copyablePieces = (which : 'top' | 'bottom') => {
        let top = which === 'top';
        if(displayOptions.reverseBoardRows) {
            top = !top;
        }

        return top ? gameControl.copyablePiecesTop : gameControl.copyablePiecesBottom;
    }

   return (
        // sbg -> Simple Board Game
        <div className="sbg"> 

                <div className="sbg__game">

                    <RowOfPieces
                        corePieces={copyablePieces('top')}
                        gameControl={gameControl}
                    />

                    <Board
                        gameControl={gameControl}
                        displayOptions={displayOptions}
                    />

                    <RowOfPieces
                        corePieces={copyablePieces('bottom')}
                        gameControl={gameControl}
                    />
                </div>
            <UserOptions gameControl={gameControl} displayOptions={displayOptions} />
        </div>
    );
}

const Game : React.FC<GameProps> = (props: GameProps) => {
    
    const gameControl = useGameControl(props); 

    const board = () => (<CoreGame gameControl={gameControl} />);


    const bgioGame  = {
        name: 'BoardGame',

        setup: () => props.pieces,
      
        moves: {
          clickCell: (G: any, ctx: any, id: number) => {
            G.cells[id] = ctx.currentPlayer;
          },
        },
      };

    const options ={
        game: bgioGame,
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
