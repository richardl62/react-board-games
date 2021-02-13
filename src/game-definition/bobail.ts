// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { SquareProperties } from '../game/game-control/game-control';
import RenderPiece from './bobail-piece';
import { PiecePosition } from '../interfaces';
import { moveResult, GameState, GameDefinitionInput } from './game-definition'
import { GameStateWrapper,  sameRowCol } from './game-state-wrapper';

// type LegalMovesArg = Parameters<LegalMoves>[0];

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

// function pieceBelongsTo(name: string, player: number) {
//     return name === `p${player + 1}`;
// }

// function setNextMove(gameState: GameState, typeToMove: getBobailState["typeToMove"]) {
//     gameState.typeToMove = typeToMove};
// }

// Get the connects of a square. Return undefined if the row and column
// and not on the board.
// function piece(pieces: BoardPieces, row: number, col: number) {
//     return pieces[row] && pieces[row][col];
// }

// // Record as legal the empty squares that are one step in any direction
// // (including diagonally) from the selected square.
// function legalMovesBobail(
//     s: { row: number, col: number },
//     pieces: BoardPieces,
//     legalMoves: Array<Array<boolean>>,
// ) {

//     for (let row = s.row - 1; row <= s.row + 1; ++row) {
//         for (let col = s.col - 1; col <= s.col + 1; ++col) {
//             legalMoves[row][col] = piece(pieces, row, col) === null;
//         }
//     }
// };

// function legalMovesPieceDirected(
//     from: PiecePosition,
//     pieces: BoardPieces,
//     legalMoves: Array<Array<boolean>>,
//     rStep: number, cStep: number
// ) {

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
// const legalMovesPiece = (
//     from: PiecePosition,
//     pieces: BoardPieces,
//     legalMoves: Array<Array<boolean>>) => {

//     for (let rStep = -1; rStep <= 1; rStep++) {
//         for (let cStep = -1; cStep <= 1; cStep++) {
//             if (rStep || cStep) {
//                 legalMovesPieceDirected(from, pieces, legalMoves, rStep, cStep);
//             }
//         }
//     }

//     return legalMoves;
// };

// const legalMoves = (    
//     from: PiecePosition, 
//     gameState: GameState,
//     activePlayer: number,
//     ) => {
//     const typeToMove = gameState.pieceTypeToMove;
//     const pieces = gameState.pieces;

//     let legalMoves = pieces.map(row => row.map(() => false));
//     gameState.legalMoves = legalMoves;

//     if (from.onBoard) {
//         const p1Name = pieces[from.row][from.col];

//         if (p1Name === bb) {
//             if(typeToMove === 'bobail') {
//                 legalMovesBobail(from, pieces, legalMoves);
//             }
//         } else if (p1Name === pl1 || p1Name === pl2) {
//             if(typeToMove === 'piece') {
//                 if(pieceBelongsTo(p1Name, activePlayer)) {
//                     legalMovesPiece(from, gameState.pieces, legalMoves);
//                 } else {
//                     console.log(p1Name, "Does not belong to player ", activePlayer);
//                 }
//             }
//         } else if (p1Name) {
//             throw new Error("Unexpected name for bobail piece: " + p1Name);
//         }
//     }
// }

function setLegalMoves(
    from: PiecePosition,
    gameState: GameStateWrapper,
) {
    gameState.setAllLegalMoves(false);
    
    // Temporary
    for (let r = 0; r < 5; ++r) {
        gameState.setLegalMove({ row: r, col: 0 }, true);
        gameState.setLegalMove({ row: r, col: 4 }, true);
    }
}

function checkForWinner(
    gameState: GameStateWrapper,
    turnOver: boolean): null | number {

    const bbPos = gameState.findPieces(bb)[0];
    if (bbPos.row === 0) {
        return 0;
    }

    if (bbPos.row === gameState.nRows - 1) {
        return 1;
    }

    if (gameState.allMovesIllegal) {
        if (turnOver) {
            return gameState.activePlayer;
        } else {
            return gameState.activePlayer === 0 ? 1 : 0;
        }
    }

    return null;
}

function onClick(
    pos: PiecePosition,
    squarePropeties: SquareProperties,
    gameState_: GameState,
    activePlayer_: number) {

    let gameState = new GameStateWrapper(gameState_, activePlayer_);
    let turnOver = false;

    const reclick = gameState.selectedSquare && sameRowCol(gameState.selectedSquare, pos);

    // If a bad square has been clicked do nothing. 
    if (!gameState.legalMove(pos) && !reclick) {
        console.log("Bad square clicked - click ingored");
        return moveResult('continue');
    }

    if (reclick) {
        gameState.selectedSquare = null;
    } else if (!gameState.selectedSquare) {
        gameState.selectedSquare = pos;
    } else {
        gameState.movePiece(gameState.selectedSquare, pos);

        if (gameState.pieceTypeToMove === 'bobail') {
            gameState.pieceTypeToMove = 'piece';
        } else if (gameState.pieceTypeToMove === 'piece') {
            gameState.pieceTypeToMove = 'bobail';
            turnOver = true;
        } else {
            throw new Error("Unrecognised move type");
        }
    }

    setLegalMoves(pos, gameState);

    const winner = checkForWinner(gameState, turnOver);
    if (winner !== null) {
        gameState.setAllLegalMoves(false);
        return moveResult({ winner: winner });
    }

    return moveResult(turnOver ? 'endOfTurn' : 'continue');
}

const games: Array<GameDefinitionInput> = [
    {
        name: 'bobail',

        gameType: 'bobail',

        boardStyle: {
            checkered: false,
            labels: true,
        },

        initialState: {
            pieces: [
                [pl1, pl1, pl1, pl1, pl1],
                [null, null, null, null, null],
                [null, null, bb, null, null],
                [null, null, null, null, null],
                [pl2, pl2, pl2, pl2, pl2],
            ],

            pieceTypeToMove: 'piece',

            legalMoves: [
                [true, true, true, true, true],
                [false, false, false, false, false],
                [false, false, false, false, false],
                [false, false, false, false, false],
                [false, false, false, false, false],
            ],

        },

        offBoardPieces: { top: [], bottom: [], },

        onClick: onClick,

        moveDescription: (gameState: GameState) => `move ${gameState.pieceTypeToMove}`,

        renderPiece: RenderPiece,
    }
];

export default games;
