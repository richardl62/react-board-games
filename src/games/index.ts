// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
// const makeGameDefinition = require('../game-creation/game-definition/make-game-definition').makeGameDefinition;
// const bobail = require('./bobail').default;
// const chess = require('./chess').default;
// const draughts = require('./draughts').default;

import { GameDefinition } from './creation';
import { makeGameDefinition, appFriendlyGame } from './creation';
import bobail from './bobail';
import chess from './chess';
import draughts from './draughts';

const gameDefinitions: Array<GameDefinition> = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));
const bgioGames = gameDefinitions.map(appFriendlyGame);
export default bgioGames;