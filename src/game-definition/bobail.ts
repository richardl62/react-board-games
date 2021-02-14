// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { SquareProperties } from '../game/game-control/game-control';
import RenderPiece from './bobail-piece';
import { RowCol, PiecePosition, samePiecePosition } from '../interfaces';
import { moveResult, GameState, GameDefinitionInput } from './game-definition'
import { GameStateWrapper  } from './game-state-wrapper';

// type LegalMovesArg = Parameters<LegalMoves>[0];

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

function playerPieceName(player: number): string {
    if (player === 0) {
        return pl1;
    } else if (player === 1) {
        return pl2;
    } else {
        throw new Error("Unexected piece number");
    }
}

function setLegalMovesBobail(
    pos: RowCol,
    gameState: GameStateWrapper,
) {
    const { row, col } = pos;

    for (let rDelta = -1; rDelta <= 1; ++rDelta) {
        for (let cDelta = -1; cDelta <= 1; ++cDelta) {
            const newPos = { row: row + rDelta, col: col + cDelta };
            if (gameState.piece(newPos) === null) {
                gameState.setLegalMove(newPos, true);
            }
        }
    }
};

function setLegalMovesPieceDirected(
    from: RowCol,
    gameState: GameStateWrapper,
    rStep: number, cStep: number
) {
    const step = (pos: RowCol) => {
        return {
            row: pos.row + rStep, 
            col: pos.col + cStep
        };
    }

    let lastNull;
    let newPos = step(from);
    while (gameState.piece(newPos) === null) {
        lastNull = newPos;
        newPos = step(newPos);
    }

    if (lastNull) {
        gameState.setLegalMove(lastNull, true);
    }
}

// Record as legal the last empty square found when stepping in
// each direction (including diagonal) from the selected square.
function setLegalMovesPiece(
    from: RowCol,
    gameState: GameStateWrapper,
    ) {

    for (let rStep = -1; rStep <= 1; rStep++) {
        for (let cStep = -1; cStep <= 1; cStep++) {
            if (rStep || cStep) {
                setLegalMovesPieceDirected(from, gameState, rStep, cStep);
            }
        }
    }
}

function setPlayerPiecesAsLegalMoves(
    player: number,
    gameState: GameStateWrapper,
) {
    const positions = gameState.findPieces(playerPieceName(player));
    for (const pos of positions) {
        gameState.setLegalMove(pos, true);
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

function updatePieceToMove(gameState: GameStateWrapper) {
    if (gameState.pieceTypeToMove === 'bobail') {
        gameState.pieceTypeToMove = 'piece';
    } else if (gameState.pieceTypeToMove === 'piece') {
        gameState.pieceTypeToMove = 'bobail';
    } else {
        throw new Error("Unrecognised move type");
    }
}

function onClick(
    pos_: PiecePosition,
    squarePropeties: SquareProperties,
    gameState_: GameState,
    activePlayer_: number) {

    if(pos_.row === undefined) {
        throw new Error("Offboard piece passed to onClick for bobail");
    }
    const pos: RowCol = pos_;

    let gameState = new GameStateWrapper(gameState_, activePlayer_);
    let turnOver = false;

    const reclick = gameState.selectedSquare && samePiecePosition(gameState.selectedSquare, pos);

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
        gameState.selectedSquare = null;

        updatePieceToMove(gameState);
        turnOver = gameState.pieceTypeToMove === 'bobail';
    }

    gameState.setAllLegalMoves(false);
    if (gameState.pieceTypeToMove === 'bobail') {
        // There is only one piece that can be moved, so select it.
        const bbPos = gameState.findPieces(bb)[0];
        gameState.selectedSquare = bbPos;

        setLegalMovesBobail(bbPos, gameState);
    } else {
        if (gameState.selectedSquare) {
            setLegalMovesPiece(gameState.selectedSquare, gameState);
        } else {
            setPlayerPiecesAsLegalMoves(gameState.nextActivePlayer, gameState);
        }
    }

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
                [false, false, false, false, false],
                [false, false, false, false, false],
                [false, false, false, false, false],
                [false, false, false, false, false],
                [true, true, true, true, true],
            ],

        },

        offBoardPieces: { top: [], bottom: [], },

        onClick: onClick,

        moveDescription: (gameState: GameState) => `move ${gameState.pieceTypeToMove}`,

        renderPiece: RenderPiece,
    }
];

export default games;
