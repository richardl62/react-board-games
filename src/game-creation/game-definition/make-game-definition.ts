import { PiecePosition, makeRowCol } from '../piece-position'
import { PieceName, BoardPieces } from "../piece-name";
import MoveControl from './move-control';
import { MoveResult } from './move-result';
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

type MakeMove = (from: PiecePosition, to: PiecePosition, moveControl: MoveControl) => void

function simpleMove(from: PiecePosition, to: PiecePosition, moveControl: MoveControl) {
    moveControl.movePiece(
        makeRowCol(from),
        makeRowCol(to)
    );
}

function simpleClickToMove(
    clickPos: PiecePosition,
    moveControl: MoveControl,
    makeMove: MakeMove) {
    const selected = moveControl.selectedSquare;
    if (selected === null) {
        // Select the clicked square unless it is empty.
        if (moveControl.piece(makeRowCol(clickPos))) {
            moveControl.selectedSquare = clickPos;
        }
    } else {
        // Clear the selected sqaure before (potentailly) calling makeMove.
        // Duing it after would overwrite any value set by makeMove. 
        moveControl.selectedSquare = null;

        if (selected !== clickPos) {
            makeMove(makeRowCol(selected), clickPos, moveControl);
            return new MoveResult('endOfTurn');
        }
    }

    return new MoveResult('continue');
}

function simpleOnClick(makeMove: MakeMove): OnClick {
    return (pos, moveControl) => simpleClickToMove(pos, moveControl, makeMove);
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
