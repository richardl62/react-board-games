import { PieceName, BoardPieces, PiecePosition } from '../interfaces'

// The types of the supported games.
type GameType = 'bobail' | 'chess' | 'draughts';

class Board {
    constructor(pieces: BoardPieces) {
        this._pieces = pieces;
    }
    private _pieces: BoardPieces;

    get(pos: PiecePosition) {
        return this._pieces[pos.row][pos.col];
    }

    set(pos: PiecePosition, to: PieceName|null) {
        this._pieces[pos.row][pos.col] = to;
    }

    move(from: PiecePosition, to: PiecePosition) {
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
        readonly selectedSquare: PiecePosition;
        readonly gameState: GameState;
    }
    ) => (Array<Array<boolean>> | null)

type MakeMove = (
    arg: {
        readonly from: PiecePosition;
        readonly to: PiecePosition;
        pieces: BoardPieces;
        gameState: GameState;
    }
) => 'end-turn' | 'continue' | 'bad';

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
};

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
};

const defaultLegalMoves: LegalMoves = () => null;
const defaultMakeMove: MakeMove = ({from, to, pieces}) => {
    let board = new Board(pieces);
    board.move(from, to);

    return 'end-turn';
}

const defaultGameState = {shared: {}}
function gameDefinition(input: GameDefinitionInput) : GameDefinition {
    return {
        legalMoves: defaultLegalMoves, 
        makeMove: defaultMakeMove,
        gameState: defaultGameState,
        ...input
    };
}

export { gameDefinition, Board }
export type { GameDefinition, GameDefinitionInput, LegalMoves, MakeMove, GameState }
