import { AppGame } from '../shared/types';
import bobail from './bobail/bobail';
import chess from './chess/chess';
import draughts from './draughts/draughts';
import plusminus from './plus-minus/plus-minus';

export const games : Array<AppGame> = [...bobail, ...chess, ...draughts, ...plusminus];