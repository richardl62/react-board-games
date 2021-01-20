import {
    BoardProps as BoardPropsTemplate,
    Client, // To do: (Somehow) set the template parameter before exporting
} from 'boardgame.io/react';

import { GameDefinition, PieceName } from './interfaces';


/*
    KLUDGE?
    
    PiecePositions should not be directly passed to a Bgio. (Doing the past 
    this caused problems, presumably because PiecePosition is a class and so
    cannot be serialised as JSON.)
    Using different name prevent them being passed in. And as we are doing this
    it seems only polite to provide a conversion function.
    (NOTE: Typescript requires only that the specified interface exist, so a 
    PiecePosition can be compatible with a non-class interface.)
*/
interface RowAndCol {
    r: number;
    c: number;
}

function rowAndCol(pos: { row: number, col: number }): RowAndCol {
    return { r: pos.row, c: pos.col, }
}

interface Position {
    r?: number;
    c?: number;
    top?: number;
    bottom?: number;
}

function makePosition(pos: {
    row?: number,
    col?: number,
    top?: number,
    bottom?: number,
}): Position {
    return {
        r: pos.row,
        c: pos.col,
        top: pos.top,
        bottom: pos.bottom,
    }
}

function unmakePosition(pos: Position) {
    return {
        row: pos.r,
        col: pos.c,
        top: pos.top,
        bottom: pos.bottom,
    }
}

interface G {
    pieces: Array<Array<PieceName | null>>;
    selectedSquare: Position | null;
    legalMoves: Array<Array<boolean>> | null;
};

type BoardProps = BoardPropsTemplate<G>;

interface MovePieceArg {
    from: RowAndCol;
    to: RowAndCol;
};

function movePiece(g: G, ctx: any, { from, to }: MovePieceArg) {
    //console.log("movePiece", from, to);

    g.pieces[to.r][to.c] = g.pieces[from.r][from.c];
    g.pieces[from.r][from.c] = null;
}

type ClearAllArg = void;
function clearAll(g: G, ctx: any) {
    //console.log("clearAll");

    g.pieces.forEach(row => row.fill(null));
}

interface SetPieceArg {
    pos: RowAndCol;
    pieceName: PieceName | null;
};

function setPiece(g: G, ctx: any, { pos, pieceName }: SetPieceArg) {
    g.pieces[pos.r][pos.c] = pieceName;
}


interface SetSelectedSquareArg {
    selected: Position | null;
    legalMoves: Array<Array<boolean>> | null;
};

function setSelectedSquare(g: G, ctx: any, { selected, legalMoves }: SetSelectedSquareArg) {

    g.selectedSquare = selected;
    g.legalMoves = legalMoves;
};

const moves = {
    movePiece: movePiece,
    clearAll: clearAll,
    setPiece: setPiece,
    setSelectedSquare: setSelectedSquare,
};

// Move functions as called by clients
interface ClientMoves {
    movePiece: (arg: MovePieceArg) => null;
    clearAll: (arg: ClearAllArg) => null;
    setPiece: (arg: SetPieceArg) => null;
    setSelectedSquare: (arg: SetSelectedSquareArg) => null;
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
        moves: moves,
    };
}

export type { BoardProps, G, ClientMoves }
export { makeGame, Client, rowAndCol, makePosition, unmakePosition };
export { SocketIO, Local } from 'boardgame.io/multiplayer';
