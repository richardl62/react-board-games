import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import UserOptions from './user-options';

import { GameControl, useGameHooks, Position } from './game-control'
import { GameProps, SharedGameState} from './game-interfaces';
import { Local as BgioLocal } from 'boardgame.io/multiplayer'
import { SocketIO as BgioSocketIO } from 'boardgame.io/multiplayer'
import * as Bgio from 'boardgame.io/react';
import './index.css';

const local = false;

function bgioServer() {
    if(local) {
        return BgioLocal();
    } else {
        return BgioSocketIO({ server: 'localhost:8000' });
    }
}


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

function bgioGame(gameProps: GameProps) {
    const moves = {
        clearAll(g: SharedGameState, ctx: any) {
          g.forEach(row => row.fill(null));
        },
        move(g: SharedGameState, ctx: any, from: Position, to: Position) {
            g[to.row][to.col] = g[from.row][from.col];
            g[from.row][from.col] = null;
        },
        copy(g: SharedGameState, ctx: any, from: Position, to: Position) {
            g[to.row][to.col] = g[from.row][from.col];
        },
        clear(g: SharedGameState, ctx: any, pos: Position) {
            g[pos.row][pos.col] = null;
        }
    };

    return {
        name: gameProps.name,
        setup: () => gameProps.pieces,
        moves: moves,
    };
}

const Game : React.FC<GameProps> = (gameProps: GameProps) => {
    
    const gameHooks = useGameHooks(); 

    const board = (bgioProps: BgioProps) => {
        const gameControl = new GameControl(gameHooks, gameProps, bgioProps);
        return (<CoreGame gameControl={gameControl}/>);
    };
    
    const options ={
        game: bgioGame(gameProps),
        board: board,
        multiplayer: bgioServer(),
    };

    const Bg = Bgio.Client(options);

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return (
        <DndProvider backend={HTML5Backend}>
            <Bg playerID="0"/>
            {/* <Bg playerID="1"/> */}
        </DndProvider>
    );
};

export default Game;
export {bgioGame};
