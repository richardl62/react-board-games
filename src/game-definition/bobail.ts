// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { BoardPieces } from '../interfaces';
import { GameDefinitionInput, Board, GameState, 
      LegalMoves, MakeMove } from './game-definition';
import RenderPiece from './bobail-piece';

type LegalMovesArg = Parameters<LegalMoves>[0];

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

interface BobailState {
    nextMove: 'bobail' | 'piece';
}

function bobailState(gameState: GameState):  BobailState {
    return gameState.shared;
}

function makeGameState(bobailState: BobailState): GameState {
    return {shared: bobailState};
}

function setNextMove(gameState: GameState, nextMove: BobailState["nextMove"]) {
    gameState.shared = {nextMove: nextMove};
}

// Get the connects of a square. Return undefined if the row and column
// and not on the board.
function piece( pieces: BoardPieces, row: number, col:number) {
        return pieces[row] && pieces[row][col];
    }

// Record as legal the empty squares that are one step in any direction
// (including diagonally) from the selected square.
const legalMovesBobail = ({ from, pieces } : LegalMovesArg,
    legalMoves: Array<Array<boolean>>) => {
    const s = from;

    for (let row = s.row - 1; row <= s.row + 1; ++row) {
        for (let col = s.col - 1; col <= s.col + 1; ++col) {
            legalMoves[row][col] = piece(pieces, row, col) === null;
        }
    }
};

function legalMovesPieceDirected (
    { from, pieces }: LegalMovesArg,
    legalMoves: Array<Array<boolean>>,
    rStep: number, cStep: number
    ) {

    let { row, col } = from;

    while (piece(pieces, row + rStep, col + cStep) === null) {
        row += rStep;
        col += cStep;
    }

    if (pieces[row][col] === null) {
        legalMoves[row][col] = true;
    }

    return legalMoves;
}

// Record as legal the last empty square found when stepping in
// each direction (including diagonal) from the selected square.
const legalMovesPiece = (args: LegalMovesArg, legalMoves: Array<Array<boolean>>) => {

    for (let rStep = -1; rStep <= 1; rStep++) {
        for (let cStep = -1; cStep <= 1; cStep++) {
            if (rStep || cStep) {
                legalMovesPieceDirected(args, legalMoves, rStep, cStep);
            }
        }
    }

    return legalMoves;
};

const legalMoves: LegalMoves = (args) => {
    const s = args.from;
    const nextMove = bobailState(args.gameState).nextMove;

    let legalMoves = args.pieces.map(row => row.map(() => false));

    if (s.onBoard) {
        const p1Name = args.pieces[s.row][s.col];

        if (p1Name === bb) {
            if(nextMove === 'bobail') {
                legalMovesBobail(args, legalMoves);
            }
        } else if (p1Name === pl1 || p1Name === pl2) {
            if(nextMove === 'piece') {
                legalMovesPiece(args, legalMoves);
            }
        } else if (p1Name) {
            throw new Error("Unexpected name for bobail piece: " + p1Name);
        }
    }

    return legalMoves;
}

const makeMove: MakeMove = ({from, to, pieces, gameState}) => {
    let board = new Board(pieces);
    let movingBobail = board.get(from) === bb;

    board.move(from, to);
    if(movingBobail) {
        setNextMove(gameState, 'piece');
        return 'continue';
    } else {
        setNextMove(gameState, 'bobail');
        return 'end-turn';
    }
}

const games: Array<GameDefinitionInput> = [
    {
        name: 'bobail',

        gameType: 'bobail',

        boardStyle: {
            checkered: false,
            labels: true,
        },

        renderPiece: RenderPiece,

        pieces: [
            [pl1, pl1, pl1, pl1, pl1],
            [null, null, null, null, null],
            [null, null, bb, null, null],
            [null, null, null, null, null],
            [pl2, pl2, pl2, pl2, pl2],
        ],

        offBoardPieces: { top: [], bottom: [], },

        gameState: makeGameState({nextMove: 'piece'}),

        legalMoves: legalMoves,

        makeMove: makeMove,

        moveDescription: (gameState: GameState) => `move ${bobailState(gameState).nextMove}`,
    }
];

export default games;
