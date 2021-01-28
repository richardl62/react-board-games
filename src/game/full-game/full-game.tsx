// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';

import GameControl, { useGameControlProps } from '../game-control'
import { GameDefinition } from '../../interfaces';
import SimpleGame from '../game-layout';

import * as bgio from '../../bgio';

// Return a component that takes Bgio props and renders a game.
function useRenderGame(gameDefinition: GameDefinition) {
    const gameControlProps = useGameControlProps(gameDefinition);
    return (bgioProps: bgio.BoardProps) => {
        const gameControl = new GameControl(bgioProps, gameControlProps);
        return (<SimpleGame gameControl={gameControl} />);
    };
}

interface FullGameProps {
    gameDefinition: GameDefinition;
    server: string | null;
    playerPerBrowser: number;
    bgioDebugPanel: boolean;
}

function FullGame(props: FullGameProps) {
    const {gameDefinition} = props;
    const renderGame = useRenderGame(gameDefinition);

    let args = {...props, renderGame:renderGame };

    const games = bgio.gamesWithClient(args);
    return <> {games} </>;
}

export default FullGame;
