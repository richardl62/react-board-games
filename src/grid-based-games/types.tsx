import { MoveControl, MoveResult } from "./control/definition";
import { PiecePosition } from "./piece-position";

export type MoveFunction = (
  from: PiecePosition,
  to: PiecePosition | null,
  moveControl: MoveControl
) => MoveResult;


export type StartingPieces = Array<Array<string|null>>;

export interface GridGameState<GameSpecific = unknown> {
  pieces: StartingPieces;
  selectedSquare: PiecePosition | null;
  legalMoves: Array<Array<boolean>> | null;
  gameSpecific?: GameSpecific;
}

export function makeGridGameState(pieces: StartingPieces) : GridGameState {
  return {
    pieces: pieces,
    selectedSquare: null,
    legalMoves: null,
  }
}