import { PieceName } from '../interfaces';

/*
    KLUDGE?
   
    PiecePositions should not be directly passed to a Bgio move function.
    (Doing the past this caused problems, presumably because PiecePosition
    is a class and so cannot be serialised as JSON.)
    Using different name prevent them being passed in. And as we are doing this
    it seems only polite to provide a conversion function.
    (NOTE: Typescript requires only that the specified interface exist, so a
    PiecePosition can be compatible with a non-class interface.)
*/
interface RowAndCol {
    r: number;
    c: number;
}


interface Position {
    r?: number;
    c?: number;
    top?: number;
    bottom?: number;
}

type Pieces = Array<Array<PieceName | null>>;
interface G {
    pieces: Pieces;
    selectedSquare: Position | null;
    legalMoves: Array<Array<boolean>> | null;
};

/* movePiece */ 

interface MovePieceArg {
    from: RowAndCol;
    to: RowAndCol;
};

function movePiece(g: G, ctx: any, { from, to }: MovePieceArg) {
    //console.log("movePiece", from, to);

    g.pieces[to.r][to.c] = g.pieces[from.r][from.c];
    g.pieces[from.r][from.c] = null;
}

/* setPiece */ 

interface SetPieceArg {
    pos: RowAndCol;
    pieceName: PieceName | null;
};

function setPiece(g: G, ctx: any, { pos, pieceName }: SetPieceArg) {
    g.pieces[pos.r][pos.c] = pieceName;
}

/* setPieces */ 

type SetPiecesArg = Pieces;
function setPieces(g: G, ctx: any, pieces: SetPiecesArg) {

    // Kludge?: Clear everything other than pieces
    g.selectedSquare = null;
    g.legalMoves = null;

    g.pieces = pieces;
}

/* setSelectedSquare */ 

interface SetSelectedSquareArg {
    selected: Position | null;
    legalMoves: Array<Array<boolean>> | null;
};

function setSelectedSquare(g: G, ctx: any, { selected, legalMoves }: SetSelectedSquareArg) {

    g.selectedSquare = selected;
    g.legalMoves = legalMoves;
};

export const moves = {
    movePiece: movePiece,
    setPiece: setPiece,
    setSelectedSquare: setSelectedSquare,
    setPieces: setPieces,
};


// Move functions as called by clients
interface ClientMoves {
    movePiece: (arg: MovePieceArg) => null;
    setPiece: (arg: SetPieceArg) => null;
    setSelectedSquare: (arg: SetSelectedSquareArg) => null;
    setPieces: (arg: SetPiecesArg) => null;
};

export type { G, ClientMoves }