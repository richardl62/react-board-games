// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.

import { AppGame } from '../shared/types';
import bobail from './bobail/bobail';
import chess from './chess/chess';
import draughts from './draughts/draughts';
import plusminus from './plus-minus/plus-minus';

const games : Array<AppGame> = [...bobail, ...chess, ...draughts];
games.push(plusminus)
export default games;
