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
    multiplayerMode: "local" | "remote" | "auto";  
    nPlayersLocal: number;
}

function FullGame( {gameDefinition, multiplayerMode, nPlayersLocal} : Props) {

    const corePieceFactory = useRef(new CorePieceFactory()).current;

    // Shared state is handled by boardgame.io.  (Is this separation a kludge?)
    const localState = {
        reverseBoard: useState(false),
    };

    
    const { protocol, hostname, port } = window.location;
    console.log(window.location);
    
    let localMode;
    if(multiplayerMode === 'auto') {
        localMode = window.location.host === "localhost:3000";
        if(localMode) {
            console.log("Setting local mode: Given mode is 'auto' and " +
               "host is 'localhost:3000'");
        }
    } else {
        localMode = multiplayerMode === 'local';
    }

    let multiplayer;
    let nPlayers;
    if (localMode) {
        console.log('Running locally');
        multiplayer = BgioLocal();
        nPlayers = nPlayersLocal;
    } else {
        const server = `${protocol}//${hostname}:${port}`;
        console.log('server:', server);
        multiplayer = BgioSocketIO({ server: server });
        nPlayers = 1;
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
    for(let count = 0; count < nPlayers; ++count) {
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
