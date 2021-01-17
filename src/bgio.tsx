import {
    BoardProps as BoardPropsTemplate,
    Client, // To do: (Somehow) set the template parameter before exporting
} from 'boardgame.io/react';

import {
    GameDefinition, PiecePosition, PieceName, GameState,
    LegalMoves,
} from './interfaces';


type G = GameState;

type BoardProps = BoardPropsTemplate<G>;

function checkPiecePosition(obj: any) {
    if (!(obj instanceof PiecePosition)) {
        throw new Error("Object is not a PiecePosition");
    }
}

function movePiece(g: G, ctx: any, from: PiecePosition, to: PiecePosition) {
    checkPiecePosition(from);
    checkPiecePosition(to);
    //console.log("Bgio movePiece", from.props, to.props);
    g.pieces[to.row][to.col] = g.pieces[from.row][from.col];
    g.pieces[from.row][from.col] = null;
}

function clearAll(g: G, ctx: any) {
    g.pieces.forEach(row => row.fill(null));
}

function setPiece(g: G, ctx: any, pos: PiecePosition, pieceName: PieceName | null) {
    checkPiecePosition(pos);
    //console.log("Bgio setPiece", pos.props, pieceName,);
    g.pieces[pos.row][pos.col] = pieceName;
}

function setSelectedSquare(g: G, ctx: any, selected: PiecePosition | null,
    findLegalMoves: LegalMoves | null) {

    g.selectedSquare = selected;
    g.legalMoves = null;

    console.log('bgio setSelectedSquare', selected && selected.props);
    if (selected && findLegalMoves) {
        // Make an array of the same size as g.pieces but with every element
        // 'false'.
        let legalMoves = g.pieces.map(row => row.map(elem => false));

        findLegalMoves({
            selectedSquare: selected,
            pieces: g.pieces,
            legalMoves: legalMoves,
        });

        g.legalMoves = legalMoves;
    }
};

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
        return {
            name: gameDefinition.name.replace(/\s/g, ''),
            setup: (): G => {
                return {
                    pieces: gameDefinition.pieces,
                    selectedSquare: null,
                    legalMoves: null,
                }
            },
            moves: {
                movePiece: movePiece,
                clearAll: clearAll,
                setPiece: setPiece,
                setSelectedSquare: setSelectedSquare,
            },
        };
    }

    export type { BoardProps, G }
    export { makeGame, Client };
    export { SocketIO, Local } from 'boardgame.io/multiplayer';
