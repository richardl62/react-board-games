import { nonNull } from './tools';

// Brief name of the piece, e.g. 'p', 'P', 'n', 'N', etc. for Chess
// This plus the game type determines how pieces are displayed.
export type PieceName = string;
export type BoardPieces = Array<Array<PieceName | null>>;

function isNum(obj: number | undefined) {
    return obj !== undefined;
}

interface PiecePositionData {
    row?: number;
    col?: number;

    top?: number;
    bottom?: number;
}

interface PiecePositionInput extends PiecePositionData {
    r?: number;
    c?: number;
}

export function sanityCheckPieceData(data: PiecePositionInput) {
    const { r, c, row, col, top, bottom } = data;

    const cn = (v: number | undefined) => (v === undefined) ? 0 : 1;

    if (cn(r) !== cn(c)) {
        throw new Error("r and c are inconsitent");
    }

    if (cn(row) !== cn(col)) {
        throw new Error("row and col are inconsitent");
    }

    if (cn(r) + cn(row) + cn(top) + cn(bottom) !== 1) {
        console.log("Bad PiecePosition data", data);
        throw new Error("Position properties are inconsitent");
    }
}

// Return the positions where a piece _might_ be. (So it could refer
// to an empty square.)
export class PiecePosition {
    constructor(data: PiecePositionInput) {
        sanityCheckPieceData(data);

        const { r, c, row, col, top, bottom } = data;

        this.data = { 
            row: r || row,
            col: c || col,
            top: top,
            bottom: bottom,
         };
        Object.freeze(this);
    }

    data: PiecePositionData;

    get onBoard() { return isNum(this.data.row) && isNum(this.data.col); }
    get onTop() { return isNum(this.data.top); }
    get onBottom() { return isNum(this.data.bottom); }

    // Get values.  Throw an error if null
    get row() { return nonNull(this.data.row); }
    get col() { return nonNull(this.data.col); }
    get top() { return nonNull(this.data.top); }
    get bottom() { return nonNull(this.data.bottom); }

    // Get values.  Can return null
    getRow() { return this.data.row; }
    getCol() { return this.data.col; }
    getTop() { return this.data.top; }
    getBottom() { return this.data.bottom; }

    static same(p1: PiecePosition, p2: PiecePosition) {
        return p1.data.row === p2.data.row
            && p1.data.col === p2.data.col
            && p1.data.top === p2.data.top
            && p1.data.bottom === p2.data.bottom;
    };
}

// Intend for use in debug output.
export function pieceProps(p: PiecePosition | null) {
    return p && p.data;
}

// Exports are done inline
