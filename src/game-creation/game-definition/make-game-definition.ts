import { PiecePosition, samePiecePosition, makeRowCol } from '../piece-position'
import { PieceName, BoardPieces } from "../piece-name";
import MoveControl from './move-control';
import { MoveResult, MoveResultArg } from './move-result';
import { GameDefinition, BoardStyle, OnClick, MoveDescription } from './game-definition';

// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinition
interface GameDefinitionInput<GameSpecificState = never> {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    initialState: {
        pieces: BoardPieces;
        legalMoves?: Array<Array<boolean>>;
        selectedSqaure?: PiecePosition | null,
        gameSpecific?: GameSpecificState,
    };

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };


    renderPiece: (props: { pieceName: PieceName }) => JSX.Element;

    onClick?: OnClick;

    moveDescription?: MoveDescription;
};


function simpleMove(from: PiecePosition, to: PiecePosition, moveControl: MoveControl) : MoveResultArg {
    const toRowCol = makeRowCol(to);
    if (toRowCol === null) {
        // An off-board was selected when another piece was selected.
        // select the off-board piece.
        // KLUDGE? Is this the right place to do this?
        moveControl.selectedSquare = to;
    } else {
        moveControl.setPiece(toRowCol, moveControl.piece(from));

        const fromRowCol = makeRowCol(from);
        if (fromRowCol) {
            moveControl.setPiece(fromRowCol, null)
        }
    }

    return 'endOfTurn';
}

type SimpleMakeMove = (from: PiecePosition, to: PiecePosition, moveControl: MoveControl) => MoveResultArg;

function simpleClickMove(
    clickPos: PiecePosition,
    moveControl: MoveControl,
    makeMove: SimpleMakeMove) {

    const selected = moveControl.selectedSquare;
    
    if (selected === null) {
        // Select the clicked square unless it is empty.
        if (moveControl.piece(clickPos)) {
            moveControl.selectedSquare = clickPos;
        }
    } else if (samePiecePosition(selected,clickPos)) {
        // if the square is selected twice 'cancel' the first click
        moveControl.selectedSquare = null;
    }  else  {
        // Make a move.
        // Clear the selected sqaure before (potentailly) calling makeMove.
        // Doing it after would overwrite any value set by makeMove. 
        moveControl.selectedSquare = null;
        const moveResult = makeMove(selected, clickPos, moveControl);
        return new MoveResult(moveResult);
    }

    return new MoveResult('continue');
}

function simpleOnClick(makeMove: SimpleMakeMove): OnClick {
    return (pos, moveControl) => simpleClickMove(pos, moveControl, makeMove);
}

function defaultMoveDescription() { return null; }

function makeGameDefinition<GameSpecificState = never>(input: GameDefinitionInput<GameSpecificState>): GameDefinition {
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
export type { GameDefinitionInput }
