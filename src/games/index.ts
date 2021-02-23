// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
import { GameDefinition } from '../game-creation'
const makeGameDefinition = require('../game-creation/game-definition/make-game-definition').makeGameDefinition;
const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;
const games: Array<GameDefinition> = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));
export default games;