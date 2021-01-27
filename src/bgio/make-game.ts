import { GameDefinition } from '../interfaces';
import { G, moves } from './moves';

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        setup: (): G => {
            return {
                pieces: gameDefinition.pieces,
                selectedSquare: null,
                legalMoves: null,
            };
        },
        moves: moves,
    };
}

export default makeGame;
