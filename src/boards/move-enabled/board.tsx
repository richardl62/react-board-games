import { ReactNode } from "react";
import { map2DArray } from "../../shared/tools";
//import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";

export interface Element extends Basic.SquareStyle {
    piece: ReactNode;
} 

export interface SquareID<BoardId = never> {
    row: number;
    col: number;
    boardID?: BoardId;
}

export interface BoardProps<BoardId = never> extends Basic.BoardStyle {
    pieces: Array<Array<Element>>;
    id?: BoardId;

    onClick?: (square: SquareID<BoardId>) => void;
    
    /** Call at the (possible) start of a move. If false (rather then undefined)
     * dragging is disabled.
     * 
     * NOTE: In practice, the start of a move means onMouseDown.
     */
    onMoveStart?: (square: SquareID<BoardId>) => boolean | undefined;

    /** Called at the end of a move.  'to' is set to null for an invalid move, 
     * e.g. dragging off the boards.
     * 
     * Will be called extactly once of each call to onMoveStart that does not
     * return false.
     */
    onMoveEnd?: (from: SquareID<BoardId>, to: SquareID<BoardId> | null) => void;
}

export function Board(props: BoardProps) {
    const {id, pieces, onClick} = props;

 
    let basicElements = map2DArray(pieces, 
        (elem, [row,col]) => {
            const squareID = {row:row, col:col, id:id};
            return {
                ...elem,
                key: `${row}-${col}`,
                onClick: onClick && (() => onClick(squareID)),
            }
        }
    );

    return <Basic.Board {...props} pieces={basicElements} />;
}