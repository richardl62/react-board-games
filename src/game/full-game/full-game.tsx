// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GameControl, { useGameControlProps } from '../game-control'
import { GameDefinition } from '../../interfaces';
import SimpleGame from '../game-layout/game-layout';

import * as bgio from '../../bgio';

interface FullGameProps {
    gameDefinition: GameDefinition;
    server: string | null;
    playerPerBrowser: number;
    bgioDebugPanel: boolean;
}

function FullGame(props: FullGameProps) {
    const { playerPerBrowser, gameDefinition } = props;


    let gameControlProps = useGameControlProps(gameDefinition);
    function renderGame(bgioProps: bgio.BoardProps) {
        let gameControl = new GameControl(bgioProps, gameControlProps);
        return <SimpleGame gameControl={gameControl} />;
    }

    const BgClient = bgio.makeClient({
        ...props,
        renderGame: renderGame,
        numPlayers: playerPerBrowser, // KLUDGE - valid only for single player game
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
