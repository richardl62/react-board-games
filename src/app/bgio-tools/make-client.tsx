import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { Game } from '../game'

interface MakeClientParam {
    game: Game;
    server: string | null;
    bgioDebugPanel: boolean;
    numPlayers: number;
}

function makeClient({ game, server, bgioDebugPanel, numPlayers }: MakeClientParam) {
    // console.log("makeCient",arguments[0]);
    let multiplayer;
    if (server) {
        console.log('Connecting to server:', server);
        multiplayer = SocketIO({ server: server });

    } else {
        multiplayer = Local();
    }

    return Client({
        multiplayer: multiplayer,
        game: game,
        board: game.renderGame,
        debug: bgioDebugPanel,
        numPlayers: numPlayers,
    });
}
export { makeClient };
