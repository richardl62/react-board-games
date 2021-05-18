import { ReactNode } from "react";
import { map2DArray } from "../../shared/tools";
//import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";

export interface Element extends Basic.SquareStyle {
    piece: ReactNode;
} 

export interface SquareID {
    row: number;
    col: number;
    boardID?: string;
}

export interface BoardProps extends Basic.BoardStyle {
    elements: Array<Array<Element>>;
    id?: string;

    onClick?: (square: SquareID) => void;
    
    /** Call at the (possible) start of a move. If false (rather then undefined)
     * dragging is disabled.
     * 
     * NOTE: In practice, the start of a move means onMouseDown.
     */
    onMoveStart?: (square: SquareID) => boolean | undefined;

    /** Called at the end of a move.  'to' is set to null for an invalid move, 
     * e.g. dragging off the boards.
     * 
     * Will be called extactly once of each call to onMoveStart that does not
     * return false.
     */
    onMoveEnd?: (from: SquareID, to: SquareID | null) => void;
}

export function Board(props: BoardProps) {
    const {id, elements: pieces, onClick, onMoveStart, onMoveEnd} = props;

 
    let basicElements = map2DArray(pieces, 
        (elem, [row,col]) : Basic.Element<SquareID> => {
            const squareID = {row:row, col:col, id:id};
            return {
                ...elem,
                key: `${row}-${col}`,
                label: squareID,
                onClick: onClick,
                onMouseDown: onMoveStart,
                onDrop: onMoveEnd,
            }
        }
    );

    return <Basic.Board {...props} elements={basicElements} />;
}