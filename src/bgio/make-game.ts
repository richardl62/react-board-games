import { G } from './moves';
import { GameDefinition } from '../game-definition'

// Use require as this file is loading into the server and
// that does not (fully) support import.
const moves = require('./moves').default;

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        setup: (): G =>  gameDefinition.intialState,
        moves: moves,
    };
}

export default makeGame;
