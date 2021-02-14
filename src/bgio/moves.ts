import { PiecePosition, BoardPieces } from '../interfaces';

interface G {
    pieces: BoardPieces;
    selectedSquare: PiecePosition | null;
    pieceTypeToMove: string | null;
    
    legalMoves: Array<Array<boolean>> | null;
};

type SetPiecesArg = BoardPieces;
function setPieces(g: G, ctx: any, pieces: SetPiecesArg) {

    // Kludge?: Clear everything other than pieces
    g.selectedSquare = null;
    g.legalMoves = null;

    g.pieces = pieces;
}

type SetGameStateArg = G;
function setGameState(g: G, ctx: any, gameState: SetGameStateArg) {
    Object.assign(g, gameState);
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
