import { assertThrow as assert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { MoveFunctions, SquareID } from "./interfaces";
import { OnFunctions } from './internal/square';

type MoveType = 'none' | 'undetermined' | 'click' | 'drag';

export class ClickDragState {
    moveType: MoveType = 'none';
    start: SquareID | null = null;

    reset() {
       this.moveType = 'none';
       this.start = null;
    }
}

export function makeOnFunctions(
    moveFunctions: MoveFunctions,
    /** Read and changed */
    state: ClickDragState,
    ) : OnFunctions
{
    const onMouseDown = (sq: SquareID) => {
        //console.log("onMouseDown", sq.toString());

        // A mouse-down with no move in progress starts a move 
        // (unless disallowed by callback). At this time the type
        // of the move is undetermined.
        if (state.moveType === 'none') {
            const startMove = !moveFunctions.onMoveStart 
                || moveFunctions.onMoveStart(sq);

            if(startMove) {
                state.moveType = 'undetermined';
                state.start = sq;
            }
        } else {
            // It must be the 2nd click in a click move.
            assert(state.moveType === 'click' && state.start);
        }
    }

    const onClick = (sid: SquareID) => {

        // Call the user callback, if any.
        moveFunctions.onClick?.(sid);

        if (state.moveType === 'none') {
            // The previous onMouseDown did not start a move, which must
            // be because if was blocked by the callback. So do nothing
            // here.
        } else if (state.moveType === 'undetermined') {
            assert(sameJSON(sid, state.start), "unexpected click square");
            state.moveType = 'click';
        } else if (state.moveType === 'click') {
            assert(state.start !== null, "start square is null at end of Move");
            moveFunctions.onMoveEnd?.(state.start, sid);

            state.reset();
        } else {
            assert(false, `Unexpected move type: ${state.moveType}`);
        }
    }

    const allowDrag = (from: SquareID) => {
        // Drags are allowed only after a move has sucessfully started,
        // and are not allowed during a click-move.
        if(state.moveType === 'undetermined') {
            state.moveType = 'drag';
            return true;
        }

        return false;
    }

    const onDrop = (from: SquareID, to: SquareID | null) => {
        assert(state.moveType === 'drag');
        assert(sameJSON(from, state.start), "inconsistent start square for drop",
            from, state.start);

        moveFunctions.onMoveEnd?.(from, to);

        state.reset();
    }

    return {
        onMouseDown: onMouseDown,
        onClick: onClick,
        allowDrag: allowDrag,
        onDrop: onDrop,
    };
}
