import { nonNull } from './tools';
// The types of the supported games. 
export type GameType = 'bobail' | 'chess' | 'draughts';

// Brief name of the piece, e.g. 'p', 'P', 'n', 'N', etc. for Chess
// This plus the GameType determines how pieces are displayed.
export type PieceName = string;

// Determines how the board is displayed. Does not affect game play.
// Is this needed give we have GameType?
export interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

export interface GameState {
    pieces: Array<Array<PieceName | null>>;
    selectedSquare: PiecePosition | null;
};

export type LegalMove = ((G: GameState, p1: PiecePosition, p2: PiecePosition) => boolean);
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

    pieces: Array<Array<PieceName|null>>;

    offBoardPieces:  {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    legalMove?: LegalMove;
};

export interface PiecePositionProps {
    row?: number;
    col?: number;
    
    top?: number;
    bottom?: number;
}

function isNum(obj: number | undefined) {
    return obj !== undefined;
}
// Return the positions where a piece _might_ be. (So it could refer
// to an empty square.)
export class PiecePosition {
    constructor(props: PiecePositionProps)
        {
        this._props = props;

        this.sanityCheck();

        Object.freeze(this);
        }
    
    private _props: PiecePositionProps;

    get props() {return this._props;}
    get onBoard() { return isNum(this.props.row) && isNum(this.props.col); }
    get onTop() { return isNum(this.props.top); }
    get onBottom() { return isNum(this.props.bottom); }
    
    // Get values.  Throw an error if null
    get row() { return nonNull(this.props.row);}
    get col() { return nonNull(this.props.col);}
    get top() { return nonNull(this.props.top);}
    get bottom() { return nonNull(this.props.bottom);}

    // Get values.  Can return null
    getRow() { return this.props.row;}
    getCol() { return this.props.col;}
    getTop() { return this.props.top;}
    getBottom() { return this.props.bottom;}
    
    sanityCheck() {
        const {row, col, top, bottom} = this.props;

        const cn = (v : number| undefined) => (v === undefined) ? 0 : 1;

        if(cn(row) !== cn(col)) {
            throw new Error("Row and col are inconsitent");
        } 

        if(cn(row) + cn(top) + cn(bottom) !== 1)
        {
            throw new Error("Position properties are inconsitent");
        }
    }

    static same(p1 : PiecePosition , p2 : PiecePosition ) {
        return p1.props.row === p2.props.row
            && p1.props.col === p2.props.col
            && p1.props.top === p2.props.top
            && p1.props.bottom === p2.props.bottom;
    };
}

// Intend for use in debug output.
export function pieceProps(p: PiecePosition | null) {
    return p && p.props;
}

// Exports are done inline
