import { PiecePosition, samePiecePosition, makeRowCol } from '../../piece-position'
import { PieceName, BoardPieces } from "../piece-name";
import MoveControl from './move-control';
import { MoveResult } from './move-result';
import { GameDefinition, BoardStyle, OnClick, OnDrag, MoveDescription } from './game-definition';

type MoveFunction = (
    from: PiecePosition,
    to: PiecePosition  | null, // null -> moved off board
    moveControl: MoveControl, 
    ) => MoveResult;


// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinition
interface GameDefinitionInput<GameSpecificState = never> {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes. A simplied version is used internally to distinguish
    // different games.
    displayName: string;

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

    moveDescription?: MoveDescription;

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

function defaultMoveFunction(
    from: PiecePosition, 
    to: PiecePosition|null, 
    moveControl: MoveControl
    ) {
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

    return new MoveResult('endOfTurn');
}

function makeOnClick(makeMove: MoveFunction) {

    return (clickPos: PiecePosition, moveControl: MoveControl) => {
        const selected = moveControl.selectedSquare;

        if (selected === null) {
            // Select the clicked square unless it is empty.
            if (moveControl.piece(clickPos)) {
                moveControl.selectedSquare = clickPos;
            }
        } else if (samePiecePosition(selected, clickPos)) {
            // if the square is selected twice 'cancel' the first click
            moveControl.selectedSquare = null;
        } else {
            // Make a move.
            // Clear the selected sqaure before (potentailly) calling makeMove.
            // Doing it after would overwrite any value set by makeMove. 
            moveControl.selectedSquare = null;
            return makeMove(selected, clickPos, moveControl);
        }

        return new MoveResult('continue');
    }
}

function makeOnDrag(moveFunction: MoveFunction) : OnDrag {
    return {
        startAllowed: () => true,
        end: moveFunction,
    }
}

function onFunctions({onClick, onDrag, onMove} : GameDefinitionInput<any>) {
    
    if(onClick === undefined && onDrag === undefined ) {
        const onMove_ = (onMove === undefined) ? defaultMoveFunction : onMove;
        return {
            onClick: makeOnClick(onMove_),
            onDrag: makeOnDrag(onMove_),
        }
    }

    if(onClick !== undefined && onDrag !== undefined  && onMove === undefined) {
        return {
            onClick: onClick,
            onDrag: onDrag,
        }
    }

    throw new Error("Incorrect combination of 'on' functions");
}

function makeSimplifiedName(name: string) {
    return name.replace(/[^\w]/g, '').toLowerCase();
}

function makeGameDefinition<GameSpecificState = never>(
    input: GameDefinitionInput<GameSpecificState>): GameDefinition 
    {

    const initialState = {
        // Defaults;
        selectedSquare: null,
        legalMoves: null,

        // input value
        ...input.initialState,
    };

    const result = {
        displayName: input.displayName,
        name: makeSimplifiedName(input.displayName),
        
        boardStyle: input.boardStyle,

        offBoardPieces: input.offBoardPieces,
        renderPiece: input.renderPiece,
        moveDescription: input.moveDescription || (() => { return null; }),

        initialState: initialState,
        setup: () => initialState,

        ...onFunctions(input),
    };

    return result;
}

export { makeGameDefinition, makeOnClick, defaultMoveFunction };
export type { GameDefinitionInput }
