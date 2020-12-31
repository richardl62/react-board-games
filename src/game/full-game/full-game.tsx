// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client. 
import React from 'react';
import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BoardProps as BgioBoardProps, Client as BgioClient }
     from 'boardgame.io/react';
import { SocketIO as BgioSocketIO, Local as BgioLocal}
     from 'boardgame.io/multiplayer'
import GameControl from '../game-control/game-control'

import { GameDefinition, SharedGameState } from '../../interfaces';
import {  CorePieceFactory } from '../game-control/core-piece';
import SimpleGame from '../game-layout/game-layout';

import { makeBgioGame } from '../../shared-utilities';

interface Props {
    gameDefinition: GameDefinition; 
    localServer: boolean;
    nPlayersPerBrowser: number;
}

function FullGame( {gameDefinition, localServer, nPlayersPerBrowser} : Props) {

    const corePieceFactory = useRef(new CorePieceFactory()).current;

    // Shared state is handled by boardgame.io.  (Is this separation a kludge?)
    const localState = {
        reverseBoard: useState(false),
    };

    let multiplayer;
    if (localServer) {
        console.log('Running locally');
        multiplayer = BgioLocal();
    } else {
        const { protocol, hostname, port } = window.location;
        const server = `${protocol}//${hostname}:${port}`;
        console.log('server:', server);
        multiplayer = BgioSocketIO({ server: server });
    }

    function renderGame(bgioProps: BgioBoardProps<SharedGameState>) {
        let gameControl= new GameControl(gameDefinition, bgioProps, localState, 
            corePieceFactory);
        return <SimpleGame gameControl={gameControl} />;
    }

    const BgClient = BgioClient({
        multiplayer: multiplayer,
        game: makeBgioGame(gameDefinition),
        board: renderGame,
    });

    let games = [];
    for(let count = 0; count < nPlayersPerBrowser; ++count) {
        games.push(
            <DndProvider key={count} backend={HTML5Backend}>
                <BgClient playerID={count.toString()} />
            </DndProvider>
            );
    }

    // Having DndProvider here, rather than in 'board' prevents error
    // Cannot have two HTML5 backends at the same time
    return <> {games} </>;
}

export default FullGame;
