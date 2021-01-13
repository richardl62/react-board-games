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
};

export class BoardPosition {
    row: number;
    col: number;

    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    static same(p1 : BoardPosition , p2 : BoardPosition ) {
        return p1.row === p2.row && p1.col === p2.col;
    };
}

export interface SquareProperties {
    checkered: boolean;
    black: boolean;
    selected: boolean;
    canMoveTo: boolean;
};

// Exports are done inline
