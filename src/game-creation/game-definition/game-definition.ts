import { PiecePosition, makeRowCol } from '../piece-position'
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

    intialState : GameState<any|undefined>; // KLUGE?

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
interface GameDefinitionInput<GameSpecificState = never> {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    initialState : {
        pieces: BoardPieces;
        legalMoves?: Array<Array<boolean>>;
        selectedSqaure?: PiecePosition | null,
        gameSpecific?: GameSpecificState,
    };

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    
    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick?: OnClick;

    moveDescription?: MoveDescription;
};

type MakeMove = (from: PiecePosition, to: PiecePosition, moveControl: MoveControl) => void
 
function simpleMove(from: PiecePosition, to: PiecePosition, moveControl: MoveControl) {
    moveControl.movePiece(
        makeRowCol(from), 
        makeRowCol(to)
    );
}

function clickToMove(
    pos: PiecePosition,
    moveControl: MoveControl,
    makeMove: MakeMove) 
    {
    const selected = moveControl.selectedSquare;
    if (selected === null) {
        moveControl.selectedSquare = pos;
        return new MoveResult('continue');
    } else if(pos === selected) {
        moveControl.selectedSquare = null;
        return new MoveResult('continue');
    } else {
        moveControl.selectedSquare = null;
        makeMove(selected, pos, moveControl);
        return new MoveResult('endOfTurn')
    }   
}

function simpleOnClick(makeMove: MakeMove) : OnClick {
    return (pos, moveControl) => clickToMove(pos, moveControl, makeMove);
}

function defaultMoveDescription() { return null; }


function makeGameDefinition<GameSpecificState = never>(input: GameDefinitionInput<GameSpecificState>) : GameDefinition {
    return {
        onClick: simpleOnClick(simpleMove), 
        moveDescription: defaultMoveDescription,
        ...input,
        intialState: {
            selectedSquare: null,
            legalMoves: null,
            ...input.initialState,
        },
    };
}

export { makeGameDefinition };
export type { GameDefinition, GameDefinitionInput, OnClick, MoveDescription, GameState }