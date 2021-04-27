import { PiecePosition } from '../../piece-position'
import { PieceName, BoardPieces } from "../piece-name";
import { GameDefinition, BoardStyle, OnClick, OnDrag, MoveDescription } from './game-definition';
import { MoveFunction, onFunctions } from './on-functions';


// The properties that define an individual game so of which are optional.
// KLUDGE: Editted copy of GameDefinition
interface GameDefinitionInput<GameSpecificState = never> {
    boardStyle: BoardStyle;

    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes. A simplied version is used internally to distinguish
    // different games.
    displayName: string;

    initialState: {
        pieces: BoardPieces;
        legalMoves?: Array<Array<boolean>>;
        selectedSqaure?: PiecePosition | null,
        gameSpecific?: GameSpecificState,
    };

    offBoardPieces: {
        top: Array<PieceName>;
        bottom: Array<PieceName>;
    };

    minPlayers: number;
    maxPlayers: number;

    renderPiece: (props: { pieceName: PieceName }) => JSX.Element;

    moveDescription?: MoveDescription;

    // The 'on' options are:
    // - None of the three. This give default behaviour.
    // - onMove only. This gives customised move default, but other behaviour as defaults.
    //   (So all pieces are draggable, and default click-to-move default);
    // - onClick and OnDrag but not onMove.  This gives the full available control.
    // Kludge? With a bit of with it would be possible to build these rules into this type.
    onClick?: OnClick;
    onDrag?: OnDrag;
    onMove?: MoveFunction;
};

function makeSimplifiedName(name: string) {
    return name.replace(/[^\w]/g, '').toLowerCase();
}

function makeGameDefinition<GameSpecificState = never>(
    input: GameDefinitionInput<GameSpecificState>): GameDefinition 
    {

    const initialState = {
        // Defaults;
        selectedSquare: null,
        legalMoves: null,

        // input value
        ...input.initialState,
    };

    const result = {
        displayName: input.displayName,
        name: makeSimplifiedName(input.displayName),
        
        minPlayers: input.minPlayers,
        maxPlayers: input.maxPlayers,
        boardStyle: input.boardStyle,

        offBoardPieces: input.offBoardPieces,
        renderPiece: input.renderPiece,
        moveDescription: input.moveDescription || (() => { return null; }),

        initialState: initialState,
        setup: () => initialState,

        ...onFunctions(input),
    };

    return result;
}

export { makeGameDefinition };
export type { GameDefinitionInput }
