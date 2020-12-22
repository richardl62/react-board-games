import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Board } from './board';
import { RowOfPieces } from './row-of-pieces';
import UserOptions from './user-options';

import { GameControl, useGameHooks, Position } from './game-control'
import { GameProps, SharedGameState} from './game-interfaces';

import * as Bgio from 'boardgame.io/react';
import * as BgioMultiplayer from 'boardgame.io/multiplayer'
import './index.css';

type BgioBoardProps = Bgio.BoardProps<SharedGameState>;

const local=true;
const nPlayersPerBrowser=2;


function SimpleGame({gameControl} : {gameControl: GameControl})
{
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

const FullGame : React.FC<GameProps> = (gameProps: GameProps) => {
    
    const gameHooks = useGameHooks(); 

    function makeBoard(bgioProps: BgioBoardProps) {
        return (<SimpleGame 
            gameControl={new GameControl(gameHooks, gameProps, bgioProps)}
        />);
    }

    const multiplayer = local ? 
    BgioMultiplayer.Local() :
    BgioMultiplayer.SocketIO({ server: 'localhost:8000' });

    const BgClient = Bgio.Client({
        game: bgioGame(gameProps),
        board: makeBoard,
        multiplayer: multiplayer
    });

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return (
        <DndProvider backend={HTML5Backend}>
            {Array(nPlayersPerBrowser).fill(null).map((_,index) => 
                <BgClient key={index} playerID={index.toString()}/>
            )}
        </DndProvider>
    );
};

export default FullGame;
export {bgioGame};
