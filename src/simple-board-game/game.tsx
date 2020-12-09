import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import UserOptions from './user-options';

import { GameControl, useGameControl } from './game-control'
import { GameProps } from './game-interfaces';
import { Client as BgioClient } from 'boardgame.io/react';

import './index.css';

interface CoreGameProps {
    gameControl: GameControl;
}
const CoreGame:  React.FC<CoreGameProps> = ({gameControl} : CoreGameProps) => {
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
