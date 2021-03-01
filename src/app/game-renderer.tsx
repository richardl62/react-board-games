// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import React from 'react';
import { Game } from './game';
import * as bgio from '../bgio-tools';

// import GameControl, { useGameControlProps } from '../game-creation/game-control'

// import SimpleGame from '../game-layout';

// interface AppFriendlyGameProps {
//     game: Game;
//     bgioProps: bgio.BoardProps;
// }
// function AppFriendlyGame({bgioProps, game} : AppFriendlyGameProps) {
//     const gameControlProps = useGameControlProps(game);
//     const gameControl = new GameControl(bgioProps, gameControlProps);
        
//     return (<SimpleGame gameControl={gameControl} />);
// }
// Return a component that takes Bgio props and renders a game.
function makeGameRenderer(game: Game) {
    // return (bgioProps: bgio.BoardProps) => {
    //     return (<AppFriendlyGame 
    //         game={game}
    //         bgioProps={bgioProps}
    //         />);
    // };

    return <div>Hello. I'm a game</div>
}


interface makeGameWithClientProps {
    game: Game;
    server: string | null;
    bgioDebugPanel: boolean;
    nGames: number;
};

function makeGameWithClient({game, server, bgioDebugPanel, nGames}: makeGameWithClientProps) {
    let args = {
        game: game,
        renderGame:game.renderGame, 
        server: server,
        bgioDebugPanel: bgioDebugPanel,
        nGames: nGames,
        numPlayers: nGames,
    };

    return bgio.gamesWithClient(args);
}

export { makeGameRenderer, makeGameWithClient };
