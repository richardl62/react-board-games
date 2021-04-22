// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.




import bobail from './bobail';
import chess from './chess';
import draughts from './draughts';
import { makeGameDefinition } from './control';
import appFriendlyGame from './make-app-game'
import { AppGame } from '../shared/types';
import plusminus from './plus-minus'

const gameDefinitions = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));
const games : Array<AppGame> = gameDefinitions.map(appFriendlyGame);
games.push(plusminus)
export default games;
