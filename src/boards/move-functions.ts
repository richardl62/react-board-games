import { assertThrow as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { SquareID } from "./interfaces";
import { DragType, SquareInteraction } from './internal/square';

export interface MoveFunctions {
    onClick?: (square: SquareID) => void;

    dragType?: (square: SquareID) => DragType;

    /** Call at the (possible) start of a move. If false the move is abandoned.
     *
     * NOTE: In practice, the start of a move means onMouseDown.
     */
    onMoveStart: (square: SquareID) => boolean;

    /** Called at the end of a move.  'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     *
     * Will be called extactly once of each call to onMoveStart that does not
     * return false.  Called with 'to' === null on a 'bad' move, e.g. a drag
     * off the board.
     */
    onMoveEnd: (from: SquareID, to: SquareID | null) => void;
}

type MoveStatus = 'none' | 'mouseDown' | 'firstClick' | 'dragging';

export class ClickDragState {
    moveStatus: MoveStatus = 'none';
    start: SquareID | null = null;

    reset() {
       this.moveStatus = 'none';
       this.start = null;
    }
}

/** Set SquareInteraction members.
 * dragType is set to return 'move'.
 */
export function makeOfFunctions(
    moveFunctions: MoveFunctions,
    /** Read and changed */
    state: ClickDragState,

    
    // Not sure how useful this type specification is.
    // The idea is to make sure members are not forgotten.
    ) : Required<SquareInteraction>
{
    const onMouseDown = (sq: SquareID) => {
        //console.log("onMouseDown", sq.toString());

        // A mouse-down with no move in progress starts a move 
        // (unless disallowed by callback). At this time the type
        // of the move is undetermined.
        if (state.moveStatus === 'none') {
            const startMove = !moveFunctions.onMoveStart 
                || moveFunctions.onMoveStart(sq);

            if(startMove) {
                state.moveStatus = 'mouseDown';
                state.start = sq;
            }
        } else {
            // It must be the 2nd click in a click move.
            assert(state.moveStatus === 'firstClick' && state.start);
        }
    }

    const onClick = (sid: SquareID) => {

        // Call the user callback, if any.
        moveFunctions.onClick?.(sid);

        if (state.moveStatus === 'none') {
            // A move was not started by the mouseDown. This must
            // be because it was blocked by the callback. So do nothing
            // here.
        } else if (state.moveStatus === 'mouseDown') {
            assert(sameJSON(sid, state.start), "unexpected click square");
            state.moveStatus = 'firstClick';
        } else if (state.moveStatus === 'firstClick') {
            assert(state.start !== null, "start square is null at end of Move");
            moveFunctions.onMoveEnd?.(state.start, sid);

            state.reset();
        } else {
            assert(false, `Unexpected move type: ${state.moveStatus}`);
        }
    }

    const onDragStart = (from: SquareID) => {
        // Drags are allowed only after a move has sucessfully started,
        // and are not allowed during a click-move.
        if(state.moveStatus === 'mouseDown') {
            state.moveStatus = 'dragging';
        }
    }

    const onDrop = (from: SquareID, to: SquareID | null) => {
        assert(state.moveStatus === 'dragging');
        assert(sameJSON(from, state.start), "inconsistent start square for drop",
            from, state.start);

        moveFunctions.onMoveEnd?.(from, to);

        state.reset();
    }
    const dragType = moveFunctions.dragType || (() => DragType.move);
    return {
        onMouseDown: onMouseDown,
        onClick: onClick,
        onDragStart: onDragStart,
        dragType: dragType,
        onDrop: onDrop,
    };

}
