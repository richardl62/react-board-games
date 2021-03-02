import { PiecePosition } from '../games/piece-position'; // KLUDGE

interface GameState<GameSpecific = never> {
    pieces: Array<Array<string|null>>;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
};

export type { GameState };
