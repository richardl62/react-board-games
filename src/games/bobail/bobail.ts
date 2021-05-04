import { makeGridGame } from '../../grid-based-games';
import { onClick } from './actions';
import { Piece, bb, pl1, pl2 } from './piece';

const initialState = {
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

const bobail =
{
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 2,

    setup: () => initialState,

    offBoardPieces: { top: [], bottom: [], },

    onClick: onClick,
    onDrag: null,

    boardStyle: {
        checkered: false,
        labels: false,
    },

    renderPiece: Piece,
};

const games = [makeGridGame(bobail)];

export default games;

