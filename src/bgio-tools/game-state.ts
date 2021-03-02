import { PiecePosition, BoardPieces } from '../games/creation'; // KLUDGE

interface GameState<GameSpecific = never> {
    pieces: BoardPieces;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
};

export type { GameState };
