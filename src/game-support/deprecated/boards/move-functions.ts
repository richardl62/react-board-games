import { SquareID } from "./interfaces";
import { DragType, SquareInteraction } from "./internal/square";

export interface MoveFunctions {
    onClick?: (square: SquareID) => void;

    /** Called at the end of a move. 'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     */
    onMoveEnd: (from: SquareID, to: SquareID | null) => void;

    /** Report whether any drags should move or copy */
    dragType: (square: SquareID) => DragType;
}

export type SquareInteractionFunc = (sq: SquareID) => SquareInteraction;

export function squareInteractionFunc(
    moveFunctions: MoveFunctions,
    
    // Not sure how useful this type specification is.
    // The idea is to make sure members are not forgotten.
) : SquareInteractionFunc
{

    const onClick = (sq: SquareID) => {
        moveFunctions.onClick?.(sq);
    };

    const onDrop = (from: SquareID, to: SquareID) => {
        moveFunctions.onMoveEnd(from, to);
    };

    const dragType = (from: SquareID) => { 
        return moveFunctions.dragType(from);
    };

    return (sq: SquareID) :  Required<SquareInteraction> => {
        return {
            onClick: () => onClick(sq),
            dragType: dragType(sq),
            onDrop: (from: SquareID) => onDrop(from, sq),
        };
    };

}
