import { PiecePosition } from '../piece-position'
import { PieceName } from "../piece-name";
import { GameState } from '../../bgio-tools';
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


export type MoveDescription = (gameState: GameState) => string | null;

// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinitionInput
export interface GameDefinition {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    intialState : GameState<any|undefined>; // KLUGE?

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick: OnClick;

    moveDescription: MoveDescription;
};

// Exports are done inline