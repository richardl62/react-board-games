import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { GameDefinition } from '../interfaces';
import { G } from './moves';
import makeGame from "./make-game";


interface FullGameProps {
    gameDefinition: GameDefinition;
    server: string | null;
    bgioDebugPanel: boolean;
    renderGame: (arg: any) => JSX.Element;
    numPlayers: number;
}

function makeClient({ gameDefinition, server, bgioDebugPanel, 
    renderGame, numPlayers }: FullGameProps) {
    let multiplayer;
    if (server) {
        console.log('Connecting to server:', server);
        multiplayer = SocketIO({ server: server });

    } else {
        multiplayer = Local();
    }

    return Client<G>({
        multiplayer: multiplayer,
        game: makeGame(gameDefinition),
        board: renderGame,
        debug: bgioDebugPanel,
        numPlayers: numPlayers,
    });
}

export default makeClient;