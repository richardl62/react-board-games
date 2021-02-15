import { PieceName, BoardPieces, PiecePosition } from '../interfaces'
import { G as GameState } from '../bgio';
import MoveControl from './move-control';

// Determines how the board is displayed. Does not affect game play.
interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

class MoveResult {
    noop: boolean = false;
    continue: boolean = false;
    endOfTurn: boolean = false;
    winner: number| null = null;

    valid() {
        const c = (b:boolean) => b ? 1: 0;
        let nSet = c(this.noop) + c(this.continue) + c(this.endOfTurn) + c(this.winner !== null);

        return nSet === 1;
    }
}

function moveResult(arg: 'noop' | 'continue' | 'endOfTurn' | {winner: number}) {
    let mr = new MoveResult();
    if(arg === 'noop') {
        mr.noop = true;
    } else if (arg === 'continue') {
        mr.continue = true;
    } else if (arg === 'endOfTurn') {
        mr.endOfTurn = true;
    } else {
        mr.winner = arg.winner;
    }

    return mr;
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
        pieceTypeToMove?: string | null; // Kludge to help Bobail
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
        let moveResult = new MoveResult();
        moveResult.endOfTurn = true;
        return moveResult;
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
            pieceTypeToMove: null,
            ...input.initialState,
        },
    };
}

export { makeGameDefinition, moveResult, MoveResult }
export type { GameDefinition, GameDefinitionInput, OnClick, MoveDescription, GameState }