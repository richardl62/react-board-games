// Use of GameDefinition is not strictly necessary, but it allows type checking to be
// done in this file rather than at point of use.
import { GameDefinition, PiecePosition, GameState } from '../interfaces';

const bb = 'bb';
const pl1 = 'p1';
const pl2 = 'p2';

function legalMove(G: GameState, p1: PiecePosition, p2: PiecePosition)
{
    const legalMoveBobail = () => {
        return true;
    };

    const legalMovePlayerPiece = () => {
        return false;
    };

    if(p1.onBoard && p2.onBoard) {
        const p1Name = G.pieces[p1.row][p2.row];
    
        if(p1Name === bb) {
            return legalMoveBobail();
        } else if(p1Name === pl1 || p1Name === pl2 ) {
            return legalMovePlayerPiece();
        } else if (p1Name) {
            throw new Error("Unexpect name for bobail piece: " + p1Name);
        }
    }
    
    return false;
}

const games : Array<GameDefinition> = [
    {
        name: 'bobail',

        gameType: 'bobail',
 
        boardStyle: {
            checkered: false,
            labels: true,
        },

        pieces: [
            [pl1,  pl1,  pl1,  pl1,  pl1],
            [null, null, null, null, null],
            [null, null, bb,   null, null],
            [null, null, null, null, null],
            [pl2,  pl2,  pl2,  pl2,  pl2],
        ],

        offBoardPieces: { top: [], bottom: [], },

        legalMove: legalMove,
    }
];

export default games;