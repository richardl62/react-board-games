// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client. 
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GameControl, {useGameControlProps} from '../game-control'

import { GameDefinition } from '../../interfaces';
import SimpleGame from '../game-layout/game-layout';

import * as Bgio from '../../bgio';

interface Props {
    gameDefinition: GameDefinition; 
    multiplayerMode: "local" | "remote" | "auto";  
    nPlayersLocal: number;
    bgioDebugPanel: boolean;
}

function FullGame( {gameDefinition, multiplayerMode, nPlayersLocal, bgioDebugPanel} : Props) {
    
    const { protocol, hostname, port } = window.location;
    
    let localMode;
    if(multiplayerMode === 'auto') {
        localMode = window.location.host === "localhost:3000";
        // if(localMode) {
        //     console.log("Setting local mode: Given mode is 'auto' and " +
        //        "host is 'localhost:3000'");
        // }
    } else {
        localMode = multiplayerMode === 'local';
    }

    let multiplayer;
    let nPlayers;
    if (localMode) {
        // console.log('Running locally');
        multiplayer = Bgio.Local();
        nPlayers = nPlayersLocal;
    } else {
        const server = `${protocol}//${hostname}:${port}`;
        // console.log('server:', server);
        multiplayer = Bgio.SocketIO({ server: server });
        nPlayers = 1;
    }

    let gameControlProps = useGameControlProps(gameDefinition);
    function renderGame(bgioProps: Bgio.BoardProps) {
        let gameControl= new GameControl(bgioProps, gameControlProps);
        return <SimpleGame gameControl={gameControl} />;
    }

    const BgClient = Bgio.Client<Bgio.G>({
        multiplayer: multiplayer,
        game: Bgio.makeGame(gameDefinition),
        board: renderGame,
        debug: bgioDebugPanel,
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
