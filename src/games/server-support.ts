import { BasicGame } from '../shared/types';


//import { basicGames as chess } from './chess/chess-basic';
//import plusminus from './plus-minus/plus-minus';

const chess = require('./chess/chess-input').gamesInput;
const plusminus = require('./plus-minus/plus-minus').default;
const { makeBasicGridGame } = require('./tools/grid-based/make-basic-grid-game');
// console.log(makeBasicGridGame );
console.log(chess && makeBasicGridGame && chess.map(makeBasicGridGame));
const games : Array<BasicGame> = [plusminus, ...chess.map(makeBasicGridGame)];

export { games }