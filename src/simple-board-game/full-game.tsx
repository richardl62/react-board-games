// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client. 
import React from 'react';
import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import * as Bgio from 'boardgame.io/react';
import * as BgioMultiplayer from 'boardgame.io/multiplayer'

import { GameControl, Position } from './game-control'
import { GameProps, SharedGameState} from './game-interfaces';
import {  CorePieceFactory } from './core-piece';
import SimpleGame from './simple-game';

import './index.css';

type BgioBoardProps = Bgio.BoardProps<SharedGameState>;

const useServer=false; // If false, play is limited to a single browser.  
const nPlayersPerBrowser=2;


// Provide the 'game' object required for a boardgame.io client.
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
    
    const corePieceFactory = useRef(new CorePieceFactory()).current;

    // Shared state is handled by boardgame.io.  (Is this separation a kludge?)
    const localState = {
            reverseBoard: useState(false), 
        };

    const BgClient = Bgio.Client({
        multiplayer: useServer ? 
            BgioMultiplayer.SocketIO({ server: 'localhost:8000' }) :
            BgioMultiplayer.Local(),

        game: bgioGame(gameProps),

        board: (bgioProps: BgioBoardProps) => (<SimpleGame 
            gameControl={new GameControl(gameProps, bgioProps, localState, corePieceFactory)}
        />),

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
export { bgioGame };
