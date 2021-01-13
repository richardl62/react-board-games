import {
    BoardProps as BoardPropsTemplate,
    Client, // To do: (Somehow) set the template parameter before exporting
} from 'boardgame.io/react';

import { GameDefinition, PiecePosition, PieceName } from './interfaces';

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

        movePiece(g: G, ctx: any, from:PiecePosition, to: PiecePosition) {
            console.log("Bgio movePiece", from, to);
            g.pieces[to.row][to.col] = g.pieces[from.row][from.col];
            g.pieces[from.row][from.col] = null;
        },

        addPiece(g: G, ctx: any, pieceName: PieceName, pos: PiecePosition) {
            console.log("Bgio addPiece", pieceName, pos);
            g.pieces[pos.row][pos.col] = pieceName;
        },

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
