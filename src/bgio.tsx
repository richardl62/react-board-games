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

function checkPiecePosition(obj: any) {
    if(! (obj instanceof PiecePosition)) {
        throw new Error("Object is not a PiecePosition");
    }
}

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: G, ctx: any) {
            g.pieces.forEach(row => row.fill(null));
        },

        movePiece(g: G, ctx: any, from:PiecePosition, to: PiecePosition) {
            checkPiecePosition(from);
            checkPiecePosition(to);
            console.log("Bgio movePiece", from.props, to.props);
            g.pieces[to.row][to.col] = g.pieces[from.row][from.col];
            g.pieces[from.row][from.col] = null;
        },

        setPiece(g: G, ctx: any, pos: PiecePosition, pieceName: PieceName | null) {
            checkPiecePosition(pos);
            console.log("Bgio setPiece", pos.props, pieceName,);
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
