import { PieceName, BoardPieces, PiecePosition } from '../interfaces'

// The types of the supported games.
type GameType = 'bobail' | 'chess' | 'draughts';

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
        legalMoves: Array<Array<boolean>>;
    }
    ) => void;

type MakeMove = (
    arg: {
        pieces: BoardPieces;
        selectedSquare: PiecePosition;
        legalMoves: Array<Array<boolean>>;
    }
) => 'end-turn' | 'continue' | 'bad';

// The properties that define an individual game.
export interface GameDefinition {
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