// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';

import GameControl, { useGameControlProps } from './game-control'
import { GameDefinition } from '../interfaces';
import SimpleGame from './game-layout';

import * as bgio from '../bgio';

// Return a component that takes Bgio props and renders a game.
function useMakeGameRenderer(gameDefinition: GameDefinition) {
    const gameControlProps = useGameControlProps(gameDefinition);
    return (bgioProps: bgio.BoardProps) => {
        const gameControl = new GameControl(bgioProps, gameControlProps);
        return (<SimpleGame gameControl={gameControl} />);
    };
}
function useGameRenderers(gameDefinitions: Array<GameDefinition>) {
    let renders: Array<any> = [];

    for (let i = 0; i < gameDefinitions.length; ++i) {
        const gd = gameDefinitions[i];
        renders.push({
            gameDefinition: gd,
            // KLUDGE?: Disable check as this is a fixed-size loop. 
            // eslint-disable-next-line react-hooks/rules-of-hooks
            component: useMakeGameRenderer(gd),
        });
    }

    return renders;
}

interface useGamesWithClientProps {
    gameDefinition: GameDefinition;
    server: string | null;
    nGames: number;
    bgioDebugPanel: boolean;
}

function useGamesWithClient(props: useGamesWithClientProps) {
    const {gameDefinition} = props;
    const renderGame = useMakeGameRenderer(gameDefinition);

    let args = {...props, renderGame:renderGame };

    return bgio.gamesWithClient(args);
}

export { useGameRenderers, useGamesWithClient };
