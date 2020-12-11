import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import UserOptions from './user-options';

import { GameControl, useGameHooks } from './game-control'
import { GameProps, SharedGameState} from './game-interfaces';
import * as Bgio from 'boardgame.io/react';

import './index.css';

interface CoreGameProps {
    gameControl: GameControl ;
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


type BgioProps = Bgio.BoardProps<SharedGameState>;

const Game : React.FC<GameProps> = (gameProps: GameProps) => {
    
    const gameHooks = useGameHooks(); 

    const board = (bgioProps: BgioProps) => {
        const gameControl = new GameControl(gameHooks, gameProps, bgioProps);
        return (<CoreGame gameControl={gameControl}/>);
    };

    const bgioGame  = {
        name: 'BoardGame',

        setup: () => gameProps.pieces,
      
        moves: {
          clear(g: SharedGameState) {
            g.forEach(row => row.fill(null));
          }
        },
      };

    const options ={
        game: bgioGame,
        board: board,
    };

    const Bg = Bgio.Client(options);

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return (
        <DndProvider backend={HTML5Backend}>
            <Bg/>
        </DndProvider>
    );
}

export default Game;
