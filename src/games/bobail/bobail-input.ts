// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GridGameInput, GridGameState } from '../../layout/grid-based-board/make-basic-grid-game';
import { BobailState, pl1, bb, pl2, onClick } from './bobail-move';

const initialState: GridGameState<BobailState> = {
    pieces: [
        [pl1, pl1, pl1, pl1, pl1],
        [null, null, null, null, null],
        [null, null, bb, null, null],
        [null, null, null, null, null],
        [pl2, pl2, pl2, pl2, pl2],
    ],

    legalMoves: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [true, true, true, true, true],
    ],

    selectedSquare: null,

    gameSpecific: { moveBobailNext: false },
};

const bobail: GridGameInput<BobailState> =
{
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 2,

    setup: () => initialState,

    offBoardPieces: { top: [], bottom: [], },

    onClick: onClick,
    onDrag: null,

    // moveDescription: (gameState: GameState) => {
    //     // The ! is a KLUDGE - Prehaps shows that GameState is not defined properly.
    //     const toMove = gameState.gameSpecific!.moveBobailNext ? "bobail" : "piece";
    //     return `move ${toMove}`
    // },
};

export const bobailInput = [bobail];
