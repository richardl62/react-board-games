import { PiecePosition, BoardPieces } from '../game-creation';

interface GameState<GameSpecific = never> {
    pieces: BoardPieces;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
};

export type { GameState };
