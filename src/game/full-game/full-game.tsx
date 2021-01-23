// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GameControl, { useGameControlProps } from '../game-control'

import { GameDefinition } from '../../interfaces';
import SimpleGame from '../game-layout/game-layout';

import * as Bgio from '../../bgio';

interface Props {
    gameDefinition: GameDefinition;
    server: string | null;
    playerPerBrowser: number;
    bgioDebugPanel: boolean;
}

function FullGame({ gameDefinition, server, playerPerBrowser, bgioDebugPanel }: Props) {

    let multiplayer;
    if (server) {
        console.log('Connecting to server:', server);
        multiplayer = Bgio.SocketIO({ server: server });

    } else {
        multiplayer = Bgio.Local();
    }

    let gameControlProps = useGameControlProps(gameDefinition);
    function renderGame(bgioProps: Bgio.BoardProps) {
        let gameControl = new GameControl(bgioProps, gameControlProps);
        return <SimpleGame gameControl={gameControl} />;
    }

    const BgClient = Bgio.Client<Bgio.G>({
        multiplayer: multiplayer,
        game: Bgio.makeGame(gameDefinition),
        board: renderGame,
        debug: bgioDebugPanel,
    });

    let games = [];
    for (let count = 0; count < playerPerBrowser; ++count) {
        games.push(

            // Having DndProvider here, rather than in 'board' prevents error
            // Cannot have two HTML5 backends at the same time
            <DndProvider key={count} backend={HTML5Backend}>
                <BgClient playerID={count.toString()} />
            </DndProvider>
        );
    }

    return <> {games} </>;
}

export default FullGame;
