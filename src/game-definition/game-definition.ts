import { SquareProperties } from '../game/game-control';
import { PieceName, BoardPieces, PiecePosition } from '../interfaces'
import { G as GameState, Position } from '../bgio';

// The types of the supported games.
type GameType = 'bobail' | 'chess' | 'draughts';

interface RowCol {
    row: number;
    col: number;
}
class Board {
    constructor(pieces: BoardPieces) {
        this._pieces = pieces;
    }
    private _pieces: BoardPieces;

    get nRows () { return this._pieces.length;}
    get nCols () { return this._pieces[0].length;}
    get(pos: RowCol) {
        return this.get2(pos.row, pos.col);
    }

    get2(row: number, col: number) {
        const r = this._pieces[row];
        return r ? r[col] : r;
    }

    set(pos: RowCol, to: PieceName|null) {
        if(this.get(pos) === undefined) {
            console.log("Bad position passed to Board.set", pos);
            throw new Error("Bad position passed to Board.set");
        }
        this._pieces[pos.row][pos.col] = to;
    }

    move(from: RowCol, to: RowCol) {
        this.set(to, this.get(from));
        this.set(from, null);
    }
};

// Determines how the board is displayed. Does not affect game play.
interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

// type LegalMoves = (
//     arg: {
//         readonly pieces: BoardPieces;
//         readonly from: PiecePosition;
//         readonly gameState: GameState;
//         readonly activePlayer: number;
//     }
//     ) => Array<Array<boolean>> | null;


class MoveResult {
    noop: boolean = false;
    continue: boolean = false;
    endOfTurn: boolean = false;
    winner: number| null = null;

    valid() {
        const c = (b:boolean) => b ? 1: 0;
        let nSet = c(this.noop) + c(this.continue) + c(this.endOfTurn) + c(this.winner !== null);

        return nSet === 1;
    }
}

function moveResult(arg: 'noop' | 'continue' | 'endOfTurn' | {winner: number}) {
    let mr = new MoveResult();
    if(arg === 'noop') {
        mr.noop = true;
    } else if (arg === 'continue') {
        mr.continue = true;
    } else if (arg === 'endOfTurn') {
        mr.endOfTurn = true;
    } else {
        mr.winner = arg.winner;
    }

    return mr;
}

// type MakeMove = (
//     arg: {
//         readonly from: PiecePosition;
//         readonly to: PiecePosition;
//         pieces: BoardPieces;
//         readonly gameState: GameState;
//         readonly activePlayer: number;
//     }
// ) => MoveResult;

type OnClick = (
    pos: PiecePosition, 
    squarePropeties: SquareProperties,
    state: GameState,
    activePlayer: number
    ) => MoveResult;


// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinitionInput
interface GameDefinition {
    gameType: GameType;
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    intialState : GameState;

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick: OnClick;

    moveDescription: MoveDescription;
};

type MoveDescription = (gameState: GameState) => string | null;

// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinition
interface GameDefinitionInput {
    gameType: GameType;
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;

    initialState : {
        pieces: BoardPieces;
        legalMoves?: Array<Array<boolean>>;
        selectedSqaure?: Position | null,
        pieceTypeToMove?: string | null; // Kludge to help Bobail
    };

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    
    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    onClick?: OnClick;

    moveDescription?: MoveDescription;
};

// const defaultLegalMoves: LegalMoves = () => null;

// const defaultMakeMove: MakeMove = ({from, to, pieces}) => {
//     let board = new Board(pieces);
//     board.move(from, to);

//     let result = new MoveResult();
//     result.endOfTurn = true;
//     return result;
// }

const defaultOnClick: OnClick = (
    pos: PiecePosition, 
    squarePropeties: SquareProperties,
    gamestate: GameState,
    activePlayer: number) => {
        let moveResult = new MoveResult();
        moveResult.endOfTurn = true;
        return moveResult;
    }

const defaultMoveDescription: MoveDescription = () => null;

function makeGameDefinition(input: GameDefinitionInput) : GameDefinition {
    return {
        onClick: defaultOnClick, 
        moveDescription: defaultMoveDescription,
        ...input,
        intialState: {
            selectedSquare: null,
            legalMoves: null,
            pieceTypeToMove: null,
            ...input.initialState,
        }
    };
}

export { makeGameDefinition, Board, moveResult, MoveResult }
export type { GameDefinition, GameDefinitionInput, OnClick, MoveDescription, GameState }