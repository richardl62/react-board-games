// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
import { GameDefinition } from './game-definition';

const bobail = require('./bobail').default;
const chess = require('./chess').default;
const draughts = require('./draughts').default;

const games : Array<GameDefinition> = [...bobail, ...chess, ...draughts];

export default games;
export type { GameDefinition }