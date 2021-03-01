//import { GameState } from "./game-state";
import { GameDefinition } from '../game-creation'

// Use require as this file is loading into the server and
// that does not (fully) support import.
const moves = require('./moves').default;

// Provide the 'game' object required for a boardgame.io client.
function makeGame(gameDefinition: GameDefinition) {
    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        //setup: (): GameState<any|undefined> =>  gameDefinition.setup,
        setup: () =>  gameDefinition.initialState, // KLUDGE
        moves: moves,
    };
}

export default makeGame;
