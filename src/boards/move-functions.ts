import { assertThrow as sAssert } from '../shared/assert';
import { sameJSON } from "../shared/tools";
import { SquareID } from "./interfaces";
import { DragType, SquareInteraction } from './internal/square';

export interface MoveFunctions {
    onClick?: (square: SquareID) => void;

    /** Called at the end of a move. 'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     */
    onMoveEnd: (from: SquareID, to: SquareID | null) => void;

    /** Report whether any drags should move or copy */
    dragType: (square: SquareID) => DragType;
}

type MoveStatus = 'none' | 'dragging' | 'dropped';

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
            sAssert(statusArray.includes(state.moveStatus), "unexpected moveStatus",
                state.moveStatus);
        }

        if(start !== undefined) {
            sAssert(sameJSON(start, state.start), "unexpected start position",
                state.start);
        }
    }

    const onClick = (sq: SquareID) => {
        moveFunctions.onClick?.(sq);
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
        return moveFunctions.dragType(from);
    }

    return (sq: SquareID) :  Required<SquareInteraction> => {
        return {
            onClick: () => onClick(sq),
            onDragStart: () => onDragStart(sq),
            onDragEnd: () => onDragEnd(sq),
            dragType: dragType(sq),
            onDrop: (from: SquareID) => onDrop(from, sq),
        }
    };

}
