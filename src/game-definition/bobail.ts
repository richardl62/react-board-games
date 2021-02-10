// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinitionInput, GameState, OnClick } from './game-definition';
import RenderPiece from './bobail-piece';

// type LegalMovesArg = Parameters<LegalMoves>[0];

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';




interface BobailState {
    nextMove: 'bobail' | 'piece';
}

function bobailState(gameState: GameState):  BobailState {
    return gameState.shared;
}

function packageBobailState(bobailState: BobailState): GameState {
    return {shared: bobailState};
}

// function pieceBelongsTo(name: string, player: number) {
//     return name === `p${player+1}`;
// }

// function setNextMove(gameState: GameState, nextMove: BobailState["nextMove"]) {
//     gameState.shared = {nextMove: nextMove};
// }

// // Get the connects of a square. Return undefined if the row and column
// // and not on the board.
// function piece( pieces: BoardPieces, row: number, col:number) {
//         return pieces[row] && pieces[row][col];
//     }

// // Record as legal the empty squares that are one step in any direction
// // (including diagonally) from the selected square.
// function legalMovesBobail(
//     s: {row: number, col:number},
//     pieces: BoardPieces,
//     legalMoves: Array<Array<boolean>>,
//     ) {

//     for (let row = s.row - 1; row <= s.row + 1; ++row) {
//         for (let col = s.col - 1; col <= s.col + 1; ++col) {
//             legalMoves[row][col] = piece(pieces, row, col) === null;
//         }
//     }
// };

// function legalMovesPieceDirected (
//     { from, pieces }: LegalMovesArg,
//     legalMoves: Array<Array<boolean>>,
//     rStep: number, cStep: number
//     ) {

//     let { row, col } = from;

//     while (piece(pieces, row + rStep, col + cStep) === null) {
//         row += rStep;
//         col += cStep;
//     }

//     if (pieces[row][col] === null) {
//         legalMoves[row][col] = true;
//     }

//     return legalMoves;
// }

// // Record as legal the last empty square found when stepping in
// // each direction (including diagonal) from the selected square.
// const legalMovesPiece = (args: LegalMovesArg, legalMoves: Array<Array<boolean>>) => {

//     for (let rStep = -1; rStep <= 1; rStep++) {
//         for (let cStep = -1; cStep <= 1; cStep++) {
//             if (rStep || cStep) {
//                 legalMovesPieceDirected(args, legalMoves, rStep, cStep);
//             }
//         }
//     }

//     return legalMoves;
// };

// const legalMoves: LegalMoves = (args) => {
//     const s = args.from;
//     const {gameState, pieces, activePlayer} = args;

//     const nextMove = bobailState(gameState).nextMove;

//     let legalMoves = pieces.map(row => row.map(() => false));

//     if (s.onBoard) {
//         const p1Name = pieces[s.row][s.col];

//         if (p1Name === bb) {
//             if(nextMove === 'bobail') {
//                 legalMovesBobail(s, pieces, legalMoves);
//             }
//         } else if (p1Name === pl1 || p1Name === pl2) {
//             if(nextMove === 'piece') {
//                 if(pieceBelongsTo(p1Name, activePlayer)) {
//                     legalMovesPiece(args, legalMoves);
//                 } else {
//                     console.log(p1Name, "Does not belong to player ", activePlayer);
//                 }
//             }
//         } else if (p1Name) {
//             throw new Error("Unexpected name for bobail piece: " + p1Name);
//         }
//     }

//     return legalMoves;
// }

// function checkForWinner(pieces: BoardPieces, activePlayer: number) : number | null {
//     const nRows = pieces.length;
//     const nCols = pieces[0].length;
//     for (let r = 0; r < nRows; ++r) {
//         for (let c = 0; c < nCols; ++c) {

//             if (pieces[r][c] === bb) {
//                 if (r === 0) {
//                     return 0;
//                 } else if (r === nRows - 1) {
//                     return 1;
//                 } else {
//                     let legalMoves = pieces.map(row => row.map(() => false));
//                     legalMovesBobail({row:r, col: c}, pieces, legalMoves);
//                     const findTrue = legalMoves.find(row => row.includes(true));
//                     if(findTrue === undefined) {
//                         // The bobail cannot move so the player who make the last move wins.
//                         return activePlayer;
//                     }
//                     return null;
//                 }
//             }

//         }
//     }

//     throw new Error("Bobail not found when checking for a winner");
// }

// const makeMove: MakeMove = ({from, to, pieces, gameState, activePlayer}) => {
//     let board = new Board(pieces);
//     let movingBobail = board.get(from) === bb;

//     board.move(from, to);
//     const winner = checkForWinner(pieces, activePlayer);

//     let result = new MoveResult();
//     if(winner !== null) {
//         result.winner = winner;
//     } else if(movingBobail) {
//         setNextMove(gameState, 'piece');
//         result.continue = true;
//     } else {
//         setNextMove(gameState, 'bobail');
//         result.endOfTurn = true;;
//     }

//     return result;
// }

const onClick: OnClick = (pos, gameState) => {
    console.log(pos, gameState )
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
            [pl1,  pl1,  pl1, pl1,   pl1 ],
            [null, null, null, null, null],
            [null, null, bb,   null, null],
            [null, null, null, null, null],
            [pl2,  pl2,  pl2,  pl2,  pl2 ],
        ],

        offBoardPieces: { top: [], bottom: [], },

        gameState: packageBobailState({nextMove: 'piece'}),

        onClick: onClick,

        moveDescription: (gameState: GameState) => `move ${bobailState(gameState).nextMove}`,
    }
];

export default games;
