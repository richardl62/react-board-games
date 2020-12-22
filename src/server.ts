import 'ignore-styles'

import { Server } from 'boardgame.io/server';

/*
 * Start of kludged imports.
 */

// Explicitly load the dependancies of 'games'.
// Without this requires the gameList is empty.
require('./games/bobail/bobail');
require('./games/chess/chess');
require('./games/draughts/draughts');

// Import seems to give empty objects.
const games:any = require('./games');
const sbg:any = require('./simple-board-game');

const gamesList = games.default;
const bgioGame = sbg.bgioGame;

/*
 * End of kludged imports.
 */

console.log("games:", Object.keys(gamesList));

let bgioGames: any = [];
for(const key in gamesList) {
    bgioGames.push(bgioGame(gamesList[key]));
}

const server = Server({ games: bgioGames });

server.run(8000);