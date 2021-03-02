import { PiecePosition } from '../piece-position'; // KLUDGE

interface GameState<GameSpecific = any> {
    pieces: Array<Array<string|null>>;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
};

export type { GameState };
