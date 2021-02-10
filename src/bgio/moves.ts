import { BoardPieces } from '../interfaces';
import { GameState } from '../game-definition';
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
// interface RowAndCol {
//     r: number;
//     c: number;
// }


interface Position {
    r?: number;
    c?: number;
    top?: number;
    bottom?: number;
}

interface G {
    pieces: BoardPieces;
    selectedSquare: Position | null;
    legalMoves: Array<Array<boolean>> | null;
    gameState: GameState;
};

// /* setPiece */ 

// interface SetPieceArg {
//     pos: RowAndCol;
//     pieceName: PieceName | null;
// };

// function setPiece(g: G, ctx: any, { pos, pieceName }: SetPieceArg) {
//     g.pieces[pos.r][pos.c] = pieceName;
// }

/* setPieces */ 

type SetPiecesArg = BoardPieces;
function setPieces(g: G, ctx: any, pieces: SetPiecesArg) {

    // Kludge?: Clear everything other than pieces
    g.selectedSquare = null;
    g.legalMoves = null;

    g.pieces = pieces;
}

// /* setSelectedSquare */ 

// interface SetSelectedSquareArg {
//     selected: Position | null;
//     legalMoves: Array<Array<boolean>> | null;
// };

// function setSelectedSquare(g: G, ctx: any, { selected, legalMoves }: SetSelectedSquareArg) {

//     g.selectedSquare = selected;
//     g.legalMoves = legalMoves;
// };

type SetGameStateArg = GameState;
function setGameState(g: G, ctx: any, gameState: SetGameStateArg) {
    g.gameState = gameState;
};

const moves = {
    // setPiece: setPiece,
    setPieces: setPieces,
    // setSelectedSquare: setSelectedSquare,
    setGameState: setGameState,
};


// Move functions as called by clients
interface ClientMoves {
    // setPiece: (arg: SetPieceArg) => null;
    setPieces: (arg: SetPiecesArg) => null;
    // setSelectedSquare: (arg: SetSelectedSquareArg) => null;
    setGameState: (arg: SetGameStateArg) => null;
};

export default moves;
export type { G, ClientMoves }
