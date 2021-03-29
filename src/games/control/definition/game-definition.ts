import { PiecePosition } from '../../piece-position'
import { PieceName } from "../piece-name";
import { GameState } from '../game-state';
import MoveControl from './move-control';
import { MoveResult } from './move-result';
import { Game } from 'boardgame.io/core';

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

export type MoveDescription = (gameState: GameState<any>) => string | null;

export interface OffBoardPieces {
    top: Array<PieceName>;
    bottom: Array<PieceName>;
}

// The properties that define an individual game some of which are optional.
// KLUDGE: Editted copy of GameDefinitionInput
// NOTE: Should be suitable for use with JSON.stringify/JSON.parse (so no
// classes.)
export interface GameDefinition {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes.
    displayName: string;

    // A simplied version of displayName, with spaces removed and some other
    /// change.  This is for page names and is passed to Bgio. 
    name: string;

    
    initialState : GameState<any>

    setup: () => GameState<any>;

    offBoardPieces: OffBoardPieces;

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick: OnClick;
    onDrag: OnDrag;

    moveDescription: MoveDescription;
};

// Exports are done inline
