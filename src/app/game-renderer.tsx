// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';

import GameControl, { useGameControlProps } from '../game-creation/game-control'
import { Game } from './game';
import SimpleGame from '../game-layout';

import * as bgio from '../bgio-tools';

interface BgioFriendlyGameProps {
    game: Game;
    bgioProps: bgio.BoardProps;
}
function BgioFriendlyGame({bgioProps, game} : BgioFriendlyGameProps) {
    const gameControlProps = useGameControlProps(game);
    const gameControl = new GameControl(bgioProps, gameControlProps);
        
    return (<SimpleGame gameControl={gameControl} />);
}
// Return a component that takes Bgio props and renders a game.
function makeGameRenderer(game: Game) {
    return (bgioProps: bgio.BoardProps) => {
        return (<BgioFriendlyGame 
            game={game}
            bgioProps={bgioProps}
            />);
    };
}


interface makeGameWithClientProps {
    game: Game;
    server: string | null;
    bgioDebugPanel: boolean;
    nGames: number;
};

function makeGameWithClient({game, server, bgioDebugPanel, nGames}: makeGameWithClientProps) {
    const renderGame = makeGameRenderer(game);

    let args = {
        game: game,
        renderGame:renderGame, 
        server: server,
        bgioDebugPanel: bgioDebugPanel,
        nGames: nGames,
        numPlayers: nGames,
    };

    return bgio.gamesWithClient(args);
}

export { makeGameRenderer, makeGameWithClient };
