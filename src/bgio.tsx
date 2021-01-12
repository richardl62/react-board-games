import {
    BoardProps as BoardPropsTemplate,
    Client, // To do: (Somehow) set the template parameter before exporting
} from 'boardgame.io/react';

import { GameDefinition, BoardPosition } from './interfaces';

type PieceID = string;

interface G {
    pieces: Array<Array<PieceID | null>>;
};

type BoardProps = BoardPropsTemplate<G>;

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: G, ctx: any) {
            g.pieces.forEach(row => row.fill(null));
        },
        add(g: G, ctx: any, piece: PieceID, to: BoardPosition) {
            // if(!(piece instanceof PieceID)) {
            //     throw new Error("Object to add is not a CorePiece");
            // }
            g.pieces[to.row][to.col] = piece;
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