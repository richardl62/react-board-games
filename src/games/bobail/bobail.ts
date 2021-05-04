import { GridGameInput, makeAppGridGame } from '../../layout/grid-based-board';
import { BobailState, onClick } from './actions';
import  { Piece, bb, pl1, pl2 } from './piece';

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

const input: GridGameInput<BobailState> =
{
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 2,

    setup: () => initialState,

    offBoardPieces: { top: [], bottom: [], },

    onClick: onClick,
    onDrag: null,
};

const boardStyle = {
    checkered: false,
    labels: false,
};

const bobail = makeAppGridGame(input, boardStyle, Piece);
const games = [bobail];

export default games;

