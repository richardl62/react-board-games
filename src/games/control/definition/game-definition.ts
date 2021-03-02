import { PiecePosition } from '../../piece-position'
import { PieceName } from "../piece-name";
import { GameState } from '../../../bgio-tools';
import MoveControl from './move-control';
import { MoveResult } from './move-result';

// Determines how the board is displayed. Does not affect game play.
export interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

export type OnClick = (
    pos: PiecePosition,
    moveControl: MoveControl, 
    ) => MoveResult;

// Return true if dragging is permitted from this square.
export type DragStartAllowed = (pos: PiecePosition) => boolean;

export type OnDragEnd = (
    from: PiecePosition,
    to: PiecePosition  | null, // null -> off-board drag
    moveControl: MoveControl, 
    ) => MoveResult;


export type OnDrag = {
    startAllowed: DragStartAllowed;
    end: OnDragEnd;
} | null;

export type MoveDescription = (gameState: GameState) => string | null;

export interface OffBoardPieces {
    top: Array<PieceName>;
    bottom: Array<PieceName>;
}

// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinitionInput
// NOTE: Should be suitable for use with JSON.stringify/JSON.parse (so no
// classes.)
export interface GameDefinition {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    initialState : GameState<any|undefined>; // KLUGE?

    offBoardPieces: OffBoardPieces;

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick: OnClick;
    onDrag: OnDrag;

    moveDescription: MoveDescription;
};

// Exports are done inline
