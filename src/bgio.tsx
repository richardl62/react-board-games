import {
    BoardProps as BoardPropsTemplate,
    Client, // To do: (Somehow) set the template parameter before exporting
} from 'boardgame.io/react';

import { GameDefinition, BoardPosition } from './interfaces';

type PieceType = string;

interface G {
    pieces: Array<Array<PieceType | null>>;
};

type BoardProps = BoardPropsTemplate<G>;

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: G, ctx: any) {
            g.pieces.forEach(row => row.fill(null));
        },
        add(g: G, ctx: any, name: PieceType, to: BoardPosition) {
            g.pieces[to.row][to.col] = name;
        },
        clear(g: G, ctx: any, pos: BoardPosition) {
            g.pieces[pos.row][pos.col] = null;
        }
    };

    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        setup: () => gameDefinition,
        moves: moves,
    };
}

export type { BoardProps, G }
export { makeGame, Client };
export { SocketIO, Local } from 'boardgame.io/multiplayer';