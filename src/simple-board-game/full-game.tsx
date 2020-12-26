// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client. 
import React from 'react';
import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import * as Bgio from 'boardgame.io/react';
import * as BgioMultiplayer from 'boardgame.io/multiplayer'

import { GameControl } from './game-control'

import { GameDefinition, SharedGameState } from './internal-interfaces';
import {  CorePieceFactory } from './core-piece';
import SimpleGame from '../game/game';

import bgioGame from './bgio-game';
import './index.css';

type BgioBoardProps = Bgio.BoardProps<SharedGameState>;

const useServer=false; // If false, play is limited to a single browser.  
const nPlayersPerBrowser=1;

function FullGame(gameDefinition: GameDefinition) {

    const corePieceFactory = useRef(new CorePieceFactory()).current;

    // Shared state is handled by boardgame.io.  (Is this separation a kludge?)
    const localState = {
        reverseBoard: useState(false),
    };

    const BgClient = Bgio.Client({
        multiplayer: useServer ?
            BgioMultiplayer.SocketIO({ server: 'localhost:8000' }) :
            BgioMultiplayer.Local(),

        game: bgioGame(gameDefinition),

        board: (bgioProps: BgioBoardProps) => (<SimpleGame
            gameControl={new GameControl(gameDefinition, bgioProps, localState, corePieceFactory)} />),
    });

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return (
        <DndProvider backend={HTML5Backend}>
            {Array(nPlayersPerBrowser).fill(null).map((_, index) => <BgClient key={index} playerID={index.toString()} />
            )}
        </DndProvider>
    );
}

export default FullGame;
export { bgioGame };
