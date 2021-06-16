import { AppGame, Bgio } from '../../shared/types';
import { bb, /*Piece,*/ pl1, pl2 } from './piece';


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

type G = typeof initialState;

function Board(props: Bgio.BoardProps<G>) {
    return (
        <div>Hello. I am Bobail</div>
    )
};

export const bobail : AppGame =
{
    name: 'bobail',
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 2,

    moves: [],
    setup: () => initialState,

    board: Board,
};

