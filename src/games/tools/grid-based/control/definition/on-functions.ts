import { makeRowCol, PiecePosition, samePiecePosition } from '../../piece-position';
import { OnClick, OnDrag } from './game-definition';
import MoveControl from './move-control';
import { MoveResult } from './move-result';

export type MoveFunction = (
    from: PiecePosition,
    to: PiecePosition  | null, // null -> moved off board
    moveControl: MoveControl, 
    ) => MoveResult;


function defaultMoveFunction(
    from: PiecePosition,
    to: PiecePosition | null,
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
            moveControl.setPiece(fromRowCol, null);
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
    };
}
function makeOnDrag(moveFunction: MoveFunction): OnDrag {
    return {
        startAllowed: () => true,
        end: moveFunction,
    };
}

interface OnFunction {
    onClick?: OnClick;
    onDrag?: OnDrag;
    onMove?: MoveFunction;
};

export function onFunctions({ onClick, onDrag, onMove }: OnFunction) {

    if (onClick === undefined && onDrag === undefined) {
        const onMove_ = (onMove === undefined) ? defaultMoveFunction : onMove;
        return {
            onClick: makeOnClick(onMove_),
            onDrag: makeOnDrag(onMove_),
        };
    }

    if (onClick !== undefined && onDrag !== undefined && onMove === undefined) {
        return {
            onClick: onClick,
            onDrag: onDrag,
        };
    }

    throw new Error("Incorrect combination of 'on' functions");
}
