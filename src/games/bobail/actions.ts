
import { sameJSON } from '../../shared/tools';
import { pl1, pl2, bb } from './piece';

interface RowCol {
    row: number;
    col: number;
}

type MoveControl<T> = T|any; //KLUDGE
let MoveResult : any; //KLUDGE
type PiecePosition = any; //KLUDGE


export type BobailState = { moveBobailNext: boolean; };

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
    moveControl: MoveControl<BobailState>
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
}
;
function setLegalMovesPieceDirected(
    from: RowCol,
    moveControl: MoveControl<BobailState>,
    rStep: number, cStep: number
) {
    const step = (pos: RowCol) => {
        return {
            row: pos.row + rStep,
            col: pos.col + cStep
        };
    };

    let lastNull;
    let newPos = step(from);
    while (moveControl.pieceUnchecked(newPos) === null) {
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
    moveControl: MoveControl<BobailState>
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
    moveControl: MoveControl<BobailState>
) {
    const positions = moveControl.findPieces(playerPieceName(player));
    for (const pos of positions) {
        moveControl.setLegalMove(pos, true);
    }
}
function checkForWinner(
    moveControl: MoveControl<BobailState>,
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
export function onClick(pos_: PiecePosition, moveControl: MoveControl<BobailState>) {

    if (pos_.row === undefined) {
        throw new Error("Offboard piece passed to onClick for bobail");
    }
    const pos: RowCol = pos_;
    let turnOver = false;

    const reclick = moveControl.selectedSquare && sameJSON(moveControl.selectedSquare, pos);

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

        let gameState = moveControl.gameSpecificState;
        gameState.moveBobailNext = !gameState.moveBobailNext;
        moveControl.gameSpecificState = gameState;

        turnOver = gameState.moveBobailNext;
    }

    moveControl.setAllLegalMoves(false);
    if (moveControl.gameSpecificState.moveBobailNext) {
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
