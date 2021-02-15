// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import RenderPiece from './bobail-piece';
import { RowCol, PiecePosition, samePiecePosition } from '../interfaces';
import { MoveResult, GameState, GameDefinitionInput } from './game-definition'
import MoveControl from './move-control';

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
    moveControl: MoveControl,
) {
    const { row, col } = pos;

    for (let rDelta = -1; rDelta <= 1; ++rDelta) {
        for (let cDelta = -1; cDelta <= 1; ++cDelta) {
            const newPos = { row: row + rDelta, col: col + cDelta };
            if (moveControl.piece(newPos) === null) {
                moveControl.setLegalMove(newPos, true);
            }
        }
    }
};

function setLegalMovesPieceDirected(
    from: RowCol,
    moveControl: MoveControl,
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
    while (moveControl.piece(newPos) === null) {
        lastNull = newPos;
        newPos = step(newPos);
    }

    if (lastNull) {
        moveControl.setLegalMove(lastNull, true);
    }
}

// Record as legal the last empty square found when stepping in
// each direction (including diagonal) from the selected square.
function setLegalMovesPiece(
    from: RowCol,
    moveControl: MoveControl,
    ) {

    for (let rStep = -1; rStep <= 1; rStep++) {
        for (let cStep = -1; cStep <= 1; cStep++) {
            if (rStep || cStep) {
                setLegalMovesPieceDirected(from, moveControl, rStep, cStep);
            }
        }
    }
}

function setPlayerPiecesAsLegalMoves(
    player: number,
    moveControl: MoveControl,
) {
    const positions = moveControl.findPieces(playerPieceName(player));
    for (const pos of positions) {
        moveControl.setLegalMove(pos, true);
    }
}

function checkForWinner(
    moveControl: MoveControl,
    turnOver: boolean): null | number {

    const bbPos = moveControl.findPieces(bb)[0];
    if (bbPos.row === 0) {
        return 0;
    }

    if (bbPos.row === moveControl.nRows - 1) {
        return 1;
    }

    if (moveControl.allMovesIllegal) {
        if (turnOver) {
            return moveControl.activePlayer;
        } else {
            return moveControl.activePlayer === 0 ? 1 : 0;
        }
    }

    return null;
}

function updatePieceToMove(moveControl: MoveControl) {
    if (moveControl.pieceTypeToMove === 'bobail') {
        moveControl.pieceTypeToMove = 'piece';
    } else if (moveControl.pieceTypeToMove === 'piece') {
        moveControl.pieceTypeToMove = 'bobail';
    } else {
        throw new Error("Unrecognised move type");
    }
}

function onClick(pos_: PiecePosition, moveControl: MoveControl) {

    if(pos_.row === undefined) {
        throw new Error("Offboard piece passed to onClick for bobail");
    }
    const pos: RowCol = pos_;
    let turnOver = false;

    const reclick = moveControl.selectedSquare && samePiecePosition(moveControl.selectedSquare, pos);

    // If a bad square has been clicked do nothing. 
    if (!moveControl.legalMove(pos) && !reclick) {
        console.log("Bad square clicked - click ingored");
        return new MoveResult('continue');
    }


    if (reclick) {
        moveControl.selectedSquare = null;
    } else if (!moveControl.selectedSquare) {
        moveControl.selectedSquare = pos;
    } else {        
        if (moveControl.selectedSquare.row === undefined) {
            throw new Error("Offboard piece selected in Bobail");
        }
        moveControl.movePiece(moveControl.selectedSquare, pos);
        moveControl.selectedSquare = null;

        updatePieceToMove(moveControl);
        turnOver = moveControl.pieceTypeToMove === 'bobail';
    }

    moveControl.setAllLegalMoves(false);
    if (moveControl.pieceTypeToMove === 'bobail') {
        // There is only one piece that can be moved, so select it.
        const bbPos = moveControl.findPieces(bb)[0];
        moveControl.selectedSquare = bbPos;

        setLegalMovesBobail(bbPos, moveControl);
    } else {
        if (moveControl.selectedSquare) {
            setLegalMovesPiece(moveControl.selectedSquare, moveControl);
        } else {
            setPlayerPiecesAsLegalMoves(moveControl.nextActivePlayer, moveControl);
        }
    }

    const winner = checkForWinner(moveControl, turnOver);
    if (winner !== null) {
        moveControl.setAllLegalMoves(false);
        return new MoveResult({ winner: winner });
    }

    return new MoveResult(turnOver ? 'endOfTurn' : 'continue');
}

const games: Array<GameDefinitionInput> = [
    {
        name: 'bobail',

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

        moveDescription: (moveControl: GameState) => `move ${moveControl.pieceTypeToMove}`,

        renderPiece: RenderPiece,
    }
];

export default games;
