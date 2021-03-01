// This file provides the infrastructure (as opposed to layout) for a 'full game'.
// In particular, it sets React hooks and creates a boardgame.io (Bgio) client.
import { Game } from './game';
import * as bgio from '../bgio-tools';


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

export { makeGameWithClient };
