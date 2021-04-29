import { BasicGame } from '../shared/types';

// Use require rather than import to allow inporting into Node
const bobail = require('./bobail/bobail-input').bobailInput;
const chess = require('./chess/chess-input').chessInput;
const draughts = require('./draughts/draughts-input').draughtsInput;
const plusminus = require('./plus-minus/plus-minus-input').plusminusInput;
const { makeBasicGridGame } = require('../layout/grid-based-board/make-basic-grid-game');

export const games : Array<BasicGame> = [
    ...bobail.map(makeBasicGridGame),
    ...chess.map(makeBasicGridGame),
    ...draughts.map(makeBasicGridGame),
    ...plusminus, 
];

