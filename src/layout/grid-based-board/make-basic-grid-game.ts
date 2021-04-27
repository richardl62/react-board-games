import { BasicGame } from "../../shared/types";
import { MoveControl, MoveResult, moves } from "./control";
import { OnClick, OnDrag } from "./control/definition/game-definition";
import { PiecePosition } from "./piece-position";

type MoveFunction = (
  from: PiecePosition,
  to: PiecePosition  | null, // null -> moved off board
  moveControl: MoveControl, 
  ) => MoveResult;

export function makeSimpleName(displayName: string) {
  return displayName.toLowerCase().replace(/[^a-z0-9]/g,'');
}
  
export type StartingPieces = Array<Array<string|null>>;
export interface GridGameInput<GameSpecific = unknown> {
  displayName: string;

  startingPieces: StartingPieces,
  gameSpecific?: GameSpecific;

  offBoardPieces: {
    top: Array<string>,
    bottom: Array<string>,
  },

  minPlayers: number,
  maxPlayers: number,

  // The 'on' options are:
  // - None of the three. This give default behaviour.
  // - onMove only. This gives customised move default, but other behaviour as defaults.
  //   (So all pieces are draggable, and default click-to-move default);
  // - onClick and OnDrag but not onMove.  This gives the full available control.
  // Kludge? With a bit of with it would be possible to build these rules into this type.
  onClick?: OnClick;
  onDrag?: OnDrag;
  onMove?: MoveFunction;
};

interface GridGameState<GameSpecific = unknown> {
    pieces: Array<Array<string|null>>;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
}

export function makeBasicGridGame<GameSpecific = void>(input: GridGameInput<GameSpecific>) 
  : BasicGame<GridGameState<GameSpecific>> {
    const startingState = {
      pieces: input.startingPieces,
      selectedSquare: null,
      legalMoves: null,
      gameSpecific: input.gameSpecific,
    }
    
    return {
      name: makeSimpleName(input.displayName),
      displayName: input.displayName,

      minPlayers: input.minPlayers,
      maxPlayers: input.maxPlayers,

      setup: () => startingState,

      moves: moves,
    };
  }
