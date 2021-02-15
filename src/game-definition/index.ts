// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
//const makeGameDefinition = require('./game-control').makeGameDefinition;
import { makeGameDefinition } from '../game/game-control/game-definition';
const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;

const games = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));

export default games;