export const defaultColors = {
    boardBackground: 'rgb(100,0,0)',
    boardBorderLabels: 'white',
    
    square: 'white',
    blackSquare: 'rgb(165,42,42)',
    whiteSquare: 'rgb(255,248,220)',

    squareHover: 'rgb(200 200 100)',
    squareHighlight: 'rgb(83 243 10)', // bright green
};

export interface RowCol {
    row: number;
    col: number;
}
export interface SquareStyle {
    backgroundColor?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
}

export interface BoardStyle {
    borderLabels?: boolean;
    reverseRows?: boolean;

    gridGap?: string;
    borderWidth?: string;

    colors?: {
        background: string;
        labels: string;
    };

    squareStyle?: (rc: RowCol) => SquareStyle;
}

export interface SquareID {
    row: number;
    col: number;
    boardID?: string;
}

export interface MoveFunctions {
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

// Recommended square size. KLUDGE
export const squareSize = '50px';