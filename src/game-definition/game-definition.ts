import { PieceName, BoardPieces, PiecePosition } from '../interfaces'

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

type GameState = {shared: any}; // For now

type LegalMoves = (
    arg: {
        readonly pieces: BoardPieces;
        readonly from: PiecePosition;
        readonly gameState: GameState;
        readonly currentPlayer: number;
    }
    ) => Array<Array<boolean>> | null;

class MoveResult {
    endOfTurn: boolean = false;
    continue: boolean = false;
    illegal: boolean = false;
    winner: number| null = null;

    valid() {
        const c = (b:boolean) => b ? 1: 0;
        let nSet = c(this.endOfTurn) + c(this.continue) + c(this.illegal) + c(this.winner !== null);

        return nSet === 1;
    }
}

type MakeMove = (
    arg: {
        readonly from: PiecePosition;
        readonly to: PiecePosition;
        pieces: BoardPieces;
        gameState: GameState;
    }
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

    pieces: BoardPieces;

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    gameState: GameState;

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    legalMoves: LegalMoves;
    
    makeMove: MakeMove;

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

    pieces: BoardPieces;

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    gameState?: GameState;
    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    legalMoves?: LegalMoves;
    makeMove?: MakeMove;

    moveDescription?: MoveDescription;
};

const defaultLegalMoves: LegalMoves = () => null;

const defaultMakeMove: MakeMove = ({from, to, pieces}) => {
    let board = new Board(pieces);
    board.move(from, to);

    let result = new MoveResult();
    result.endOfTurn = true;
    return result;
}


const defaultMoveDescription: MoveDescription = () => null;

const defaultGameState = {shared: {}}
function gameDefinition(input: GameDefinitionInput) : GameDefinition {
    return {
        legalMoves: defaultLegalMoves, 
        makeMove: defaultMakeMove,
        gameState: defaultGameState,
        moveDescription: defaultMoveDescription,
        ...input
    };
}

export { gameDefinition, Board, MoveResult }
export type { GameDefinition, GameDefinitionInput, LegalMoves, MakeMove,  MoveDescription, GameState }
