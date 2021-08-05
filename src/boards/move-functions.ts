import { assertThrow as gAssert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { SquareID } from "./interfaces";
import { DragType, SquareInteraction } from './internal/square';

export interface MoveFunctions {
    onClick?: (square: SquareID) => void;

    /** Call at the (possible) start of a click move. If false the move is abandoned.
     */
    onClickMoveStart: (square: SquareID) => boolean;

    /** Called at the end of a move. 'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     *
     * Will be called extactly once for each call to onMoveStart that does not
     * return false. Called with 'to' === null on a 'bad' move, i.e. a drag
     * to a non-droppable location.
     */
    onMoveEnd: (from: SquareID, to: SquareID | null) => void;

    /** Report whether any drags should move or copy */
    dragType: (square: SquareID) => DragType;
}

type MoveStatus = 'none' | 'clickMoveStarted' | 'dragging' | 'dropped';

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
    const check = (
        funcName: string,
        moveStatus?: MoveStatus | MoveStatus[], 
        start?: SquareID | null
    ) => {
        //console.log(funcName, state.moveStatus, state.start)
        if(moveStatus !== undefined) {
            const statusArray = [moveStatus].flat()
            gAssert(statusArray.includes(state.moveStatus), "unexpected moveStatus",
                state.moveStatus);
        }

        if(start !== undefined) {
            gAssert(sameJSON(start, state.start), "unexpected start position",
                state.start);
        }
    }
    
    const onMouseDown = (sq: SquareID) => {}

    const onClick = (sq: SquareID) => {
        check("onClick");

        // Call the user callback, if any.
        moveFunctions.onClick?.(sq);

        if (state.moveStatus === 'none') {
            const startMove = moveFunctions.onClickMoveStart(sq);

            if(startMove) {
                state.moveStatus = 'clickMoveStarted';
                state.start = sq;
            }
        } else if (state.moveStatus === 'clickMoveStarted' 
            && state.start !== null // defensive
            ) {
            moveFunctions.onMoveEnd(state.start, sq);

            state.reset();
        } else {
            gAssert(false, "Unexpected state on click", state.moveStatus);
        }
    }

    const onDragStart = (from: SquareID) => {
        check("onDragStart", 'none');
            
        state.moveStatus = 'dragging';
        state.start = from;
    }

    const onDrop = (from: SquareID, to: SquareID) => {
        check('onDrop','dragging', from); 

        moveFunctions.onMoveEnd(from, to);

        state.moveStatus = 'dropped';
    }

    const onDragEnd = (from: SquareID) => {
        check('onDragEnd', ['dropped','dragging'], from);
        if(state.moveStatus !== 'dropped') {
            moveFunctions.onMoveEnd(from, null);
        }

        state.reset();
    }

    const dragType = (from: SquareID) => { 
        if(state.moveStatus === 'clickMoveStarted') {
            return DragType.disable;
        }
    
        return moveFunctions.dragType(from);
    }

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
