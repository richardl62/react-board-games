import { assertThrow as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { SquareID } from "./interfaces";
import { DragType, SquareInteraction } from './internal/square';

export interface MoveFunctions {
    onClick?: (square: SquareID) => void;

    dragType: (square: SquareID) => DragType;

    /** Call at the (possible) start of a move. If false the move is abandoned.
     *
     * NOTE: In practice, the start of a move means onMouseDown.
     */
    onMoveStart: (square: SquareID) => boolean;

    /** Called at the end of a move.  'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     *
     * Will be called extactly once of each call to onMoveStart that does not
     * return false.  Called with 'to' === null on a 'bad' move, i.e. a drag
     * to a non-droppable location.
     */
    onMoveEnd: (from: SquareID, to: SquareID | null) => void;
}

type MoveStatus = 'none' | 'mouseDown' | 'firstClick' | 'dragging' | 'dropped';

export class ClickDragState {
    moveStatus: MoveStatus = 'none';
    start: SquareID | null = null;

    reset() {
       this.moveStatus = 'none';
       this.start = null;
    }
}

export type SquareInteractionFunc = (sq: SquareID) => SquareInteraction;

export function squareInteractionFunc(
    moveFunctions: MoveFunctions,
    /** Read and changed */
    state: ClickDragState,

    
    // Not sure how useful this type specification is.
    // The idea is to make sure members are not forgotten.
    ) : SquareInteractionFunc
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
            assert(state.moveStatus === 'firstClick' && state.start,
                "Unexpected state on click", state.moveStatus
            );
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
            moveFunctions.onMoveEnd(state.start, sid);

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

    const onDrop = (from: SquareID, to: SquareID) => {
        assert(state.moveStatus === 'dragging');
        assert(sameJSON(from, state.start), "inconsistent start square for drop",
            from, state.start);

        moveFunctions.onMoveEnd(from, to);
        state.moveStatus = 'dropped';
    }

    const onDragEnd = (from: SquareID) => {
        assert(sameJSON(from, state.start), "inconsistent start square for drop",
            from, state.start);


        if(state.moveStatus !== 'dropped') {
            // The drop failed.
            assert(state.moveStatus === 'dragging', 
                "unexpected state at end of drag", state.moveStatus);
            moveFunctions.onMoveEnd(from, null);
        }

        state.reset();
    }

    const dragType = (sq: SquareID) => DragType.disable; //moveFunctions.dragType;

    return (sq: SquareID) :  Required<SquareInteraction> => {
        return {
            onMouseDown: () => onMouseDown(sq),
            onClick: () => onClick(sq),
            onDragStart: () => onDragStart(sq),
            onDragEnd: () => onDragEnd(sq),
            dragType: dragType(sq),
            onDrop: (from: SquareID) => onDrop(from, sq),
        }
    };

}
