// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinition } from '../interfaces';

const games : Array<GameDefinition> = [
    {
        name: 'bobail',

        gameType: 'bobail',
 
        boardStyle: {
            checkered: false,
            labels: true,
        },

        pieces: [
            ['p1', 'p1', 'p1', 'p1', 'p1'],
            [null, null, null, null, null],
            [null, null, 'bb', null, null],
            [null, null, null, null, null],
            ['p2', 'p2', 'p2', 'p2', 'p2'],
        ],

        offBoardPieces: { top: [], bottom: [], },
    }
];

export default games;