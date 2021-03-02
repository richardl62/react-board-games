import { GameState } from './game-state';

type SetPiecesArg = Array<Array<string|null>>;
function setPieces(GameState: GameState<never>, ctx: any, pieces: SetPiecesArg) {

    // Kludge?: Clear everything other than pieces
    GameState.selectedSquare = null;
    GameState.legalMoves = null;

    GameState.pieces = pieces;
}

type SetGameStateArg = GameState<any|undefined>;
function setGameState(GameState: GameState<never>, ctx: any, gameState: SetGameStateArg) {
    Object.assign(GameState, gameState);
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
export type { ClientMoves }
