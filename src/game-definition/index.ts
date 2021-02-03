// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
import { gameDefinition, GameDefinition, GameState } from './game-definition';

const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;

const games = [...bobail, ...chess, ...draughts].map(g => gameDefinition(g));

export default games;
export type { GameDefinition, GameState }