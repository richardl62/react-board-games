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
};

// Determines how the board is displayed. Does not affect game play.
interface BoardStyle {
    checkered: boolean; // If true, square [0][0] is 'black'

    // If type rows and columns are labels with letters and numbers;
    labels: boolean;
}

type LegalMoves = (
    arg: {
        pieces: BoardPieces;
        selectedSquare: PiecePosition;
    }
    ) => (Array<Array<boolean>> | null)

type MakeMove = (
    arg: {
        from: PiecePosition;
        to: PiecePosition;
        pieces: BoardPieces;
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

    renderPiece: (props: {pieceName: PieceName}) => JSX.Element;

    legalMoves?: LegalMoves;
    makeMove?: MakeMove;
};

const defaultLegalMoves: LegalMoves = () => null;
const defaultMakeMove: MakeMove = ({from, to, pieces}) => {
    let board = new Board(pieces);
    board.set(to, board.get(from));
    board.set(from, null);

    return 'end-turn';
}

function gameDefinition(input: GameDefinitionInput) : GameDefinition {
    return {
        legalMoves: defaultLegalMoves, 
        makeMove: defaultMakeMove,
        ...input
    };
}

export { gameDefinition }
export type { GameDefinition, GameDefinitionInput }