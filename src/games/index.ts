import { AppGame } from '../shared/types';
import bobail from './bobail';
import chess from './chess';
import draughts from './draughts';
import plusminus from './simple';

export const games : Array<AppGame> = [...bobail, ...chess, ...draughts, ...plusminus];