import * as Basic from "../basic";
import { Element } from "./board";


export interface SquareID {
    row: number;
    col: number;
    boardID?: string;
}

export interface BoardProps extends Basic.BoardStyle {
    elements: Array<Array<Element>>;
    id?: string;

    onClick?: (square: SquareID) => void;

    /** Call at the (possible) start of a move. If false (rather then undefined
     * or null) dragging is disabled.
     *
     * NOTE: In practice, the start of a move means onMouseDown.
     */
    onMoveStart?: (square: SquareID) => boolean | void;

    /** Called at the end of a move.  'to' is set to null for an invalid move,
     * e.g. dragging off the boards.
     *
     * Will be called extactly once of each call to onMoveStart that does not
     * return false.
     */
    onMoveEnd?: (from: SquareID, to: SquareID | null) => void;

    /** Call at start of drag. Determine whether drags are proceed.  
     * Defaults to always true.
     * 
     * NOTE: Drags are not allowed during a click-move unless dragging from
     * the start square for that move.
     */
    allowDrag?: (from: SquareID) => boolean;
}
