// Used locally and by the server
import 'ignore-styles'

import { Server } from 'boardgame.io/server';

/*
 * Start of kludged imports.
 */

// Explicitly import the dependancies of 'games'.
// Without this gameList is empty.
import './piece/bobail';
import './game-definition/chess';
import './piece/draughts';

// Imports other than '*' seems not to work.
import * as games from './game-definition';
import bgioGame from './simple-board-game/bgio-game';

const gamesList = games.default;

/*
 * End of kludged imports.
 */

console.log("games:", Object.keys(gamesList));

let bgioGames: any = [];
for(const key in gamesList) {
    bgioGames.push(bgioGame(gamesList[key]));
}

const server = Server({ games: bgioGames });

export default server;