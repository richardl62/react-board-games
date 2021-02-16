import { PiecePosition } from '../piece-position'
import { PieceName, BoardPieces } from "../piece-name";
import { GameState } from '../../bgio-tools';
import MoveControl from './move-control';
import { MoveResult } from './move-result';

// Determines how the board is displayed. Does not affect game play.
interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

type OnClick = (
    pos: PiecePosition,
    moveControl: MoveControl, 
    ) => MoveResult;


// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinitionInput
interface GameDefinition {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    intialState : GameState;

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick: OnClick;

    moveDescription: MoveDescription;
};

type MoveDescription = (gameState: GameState) => string | null;

// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinition
interface GameDefinitionInput {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    initialState : {
        pieces: BoardPieces;
        legalMoves?: Array<Array<boolean>>;
        selectedSqaure?: PiecePosition | null,
        gameSpecific?: any;
    };

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    
    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick?: OnClick;

    moveDescription?: MoveDescription;
};

const defaultOnClick: OnClick = () => {
        return new MoveResult('endOfTurn');
    }

const defaultMoveDescription: MoveDescription = () => null;

function makeGameDefinition(input: GameDefinitionInput) : GameDefinition {
    return {
        onClick: defaultOnClick, 
        moveDescription: defaultMoveDescription,
        ...input,
        intialState: {
            selectedSquare: null,
            legalMoves: null,
            gameSpecific: null,
            ...input.initialState,
        },
    };
}

export { makeGameDefinition };
export type { GameDefinition, GameDefinitionInput, OnClick, MoveDescription, GameState }