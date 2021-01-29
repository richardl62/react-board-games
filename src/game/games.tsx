// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';

import GameControl, { makeGameControlProps } from './game-control'
import { GameDefinition } from '../interfaces';
import SimpleGame from './game-layout';

import * as bgio from '../bgio';

// Return a component that takes Bgio props and renders a game.
function makeGameRenderer(gameDefinition: GameDefinition) {
    const gameControlProps = makeGameControlProps(gameDefinition);
    return (bgioProps: bgio.BoardProps) => {
        const gameControl = new GameControl(bgioProps, gameControlProps);
        return (<SimpleGame gameControl={gameControl} />);
    };
}
function makeGameRenderers(gameDefinitions: Array<GameDefinition>) {
    let renders: Array<any> = [];

    for (let i = 0; i < gameDefinitions.length; ++i) {
        const gd = gameDefinitions[i];
        renders.push({
            gameDefinition: gd,
            component: makeGameRenderer(gd),
        });
    }

    return renders;
}

interface makeGamesWithClientProps {
    gameDefinition: GameDefinition;
    server: string | null;
    nGames: number;
    bgioDebugPanel: boolean;
}

function makeGamesWithClient(props: makeGamesWithClientProps) {
    const {gameDefinition} = props;
    const renderGame = makeGameRenderer(gameDefinition);

    let args = {...props, renderGame:renderGame };

    return bgio.gamesWithClient(args);
}

export { makeGameRenderers, makeGamesWithClient };
