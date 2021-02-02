import { nonNull } from './tools';
// The types of the supported games.
export type GameType = 'bobail' | 'chess' | 'draughts';

// Brief name of the piece, e.g. 'p', 'P', 'n', 'N', etc. for Chess
// This plus the GameType determines how pieces are displayed.
export type PieceName = string;
export type PieceNames = Array<Array<PieceName | null>>;

// Determines how the board is displayed. Does not affect game play.
// Is this needed give we have GameType?
interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

type LegalMoves = (
    arg: {
        pieces: PieceNames;
        selectedSquare: PiecePosition;
        legalMoves: Array<Array<boolean>>;
    }
    ) => void;

type MakeMove = (
    arg: {
        pieces: PieceNames;
        selectedSquare: PiecePosition;
        legalMoves: Array<Array<boolean>>;
    }
) => 'end-turn' | 'continue' | 'bad';

// The properties that define an individual game.
// KLUDGE? Mixes display and functionality (so no clear distinction of what
// needs to be sent to the server.)
export interface GameDefinition {
    gameType: GameType;
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    pieces: PieceNames;

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    legalMoves?: LegalMoves;
    makeMove?: MakeMove;
};

interface PiecePositionData {
    row?: number;
    col?: number;

    top?: number;
    bottom?: number;
}

function isNum(obj: number | undefined) {
    return obj !== undefined;
}

export function sanityCheckPieceData(data: PiecePositionData) {
    const { row, col, top, bottom } = data;

    const cn = (v: number | undefined) => (v === undefined) ? 0 : 1;

    if (cn(row) !== cn(col)) {
        throw new Error("Row and col are inconsitent");
    }

    if (cn(row) + cn(top) + cn(bottom) !== 1) {
        console.log("Bad PiecePosition data", data);
        throw new Error("Position properties are inconsitent");
    }
}

// Return the positions where a piece _might_ be. (So it could refer
// to an empty square.)
export class PiecePosition {
    constructor(data: PiecePositionData) {
        sanityCheckPieceData(data);

        this.data = { ...data };
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
