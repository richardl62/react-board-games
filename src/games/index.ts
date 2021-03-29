// KLUDGE: Using 'require' rather than import of help with loading in the server.
// Then reimpose the type before exporting.
// const makeGameDefinition = require('../game-creation/game-definition/make-game-definition').makeGameDefinition;
// const bobail = require('./bobail').default;
// const chess = require('./chess').default;
// const draughts = require('./draughts').default;


// import bobail from './bobail';
// import chess from './chess';
// import draughts from './draughts';

// import { makeGameDefinition } from './control';
// import appFriendlyGame from './app-friendly-game'
import { Game } from '../types';
import simpleGame from './simple-game'

//const gameDefinitions : Array<Game> = [...bobail, ...chess, ...draughts].map(g => makeGameDefinition(g));
const games : Array<Game> = []; //gameDefinitions.map(appFriendlyGame);
games.push(simpleGame)
export default games;