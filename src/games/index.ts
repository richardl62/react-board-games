// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.

import { AppGame } from '../shared/types';
import bobail from './bobail/bobail';
import chess from './chess/chess';
import draughts from './draughts/draughts';
import plusminus from './plus-minus/plus-minus';
import { makeGameDefinition } from './tools/grid-based/control';
import appFriendlyGame from './tools/grid-based/make-app-game';

const gameDefinitions = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));
const games : Array<AppGame> = gameDefinitions.map(appFriendlyGame);
games.push(plusminus)
export default games;
