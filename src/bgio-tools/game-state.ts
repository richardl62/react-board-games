import { PiecePosition, BoardPieces } from '../game-creation';

interface GameState {
    pieces: BoardPieces;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific: any;
};

export type { GameState };
