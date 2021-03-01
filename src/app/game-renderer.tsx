// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';

import GameControl, { useGameControlProps } from '../game-creation/game-control'
import { GameDefinition } from '../game-creation/game-definition';
import SimpleGame from '../game-layout';

import * as bgio from '../bgio-tools';

interface BgioFriendlyGameProps {
    gameDefinition: GameDefinition;
    bgioProps: bgio.BoardProps;
}
function BgioFriendlyGame({bgioProps, gameDefinition} : BgioFriendlyGameProps) {
    const gameControlProps = useGameControlProps(gameDefinition);
    const gameControl = new GameControl(bgioProps, gameControlProps);
        
    return (<SimpleGame gameControl={gameControl} />);
}
// Return a component that takes Bgio props and renders a game.
function makeGameRenderer(gameDefinition: GameDefinition) {
    return (bgioProps: bgio.BoardProps) => {
        return (<BgioFriendlyGame 
            gameDefinition={gameDefinition}
            bgioProps={bgioProps}
            />);
    };
}

interface makeGameWithClientProps {
    gameDefinition: GameDefinition;
    nGames: number;
    bgioDebugPanel: boolean;
}

function makeGameWithClient(props: makeGameWithClientProps) {
    const {gameDefinition} = props;
    const renderGame = makeGameRenderer(gameDefinition);

    let args = {...props, renderGame:renderGame };

    return bgio.gamesWithClient(args);
}

export { makeGameRenderer, makeGameWithClient };
