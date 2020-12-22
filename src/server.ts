import 'ignore-styles'

import { Server } from 'boardgame.io/server';

/*
 * Start of kludged imports.
 */

// Explicitly import the dependancies of 'games'.
// Without this gameList is empty.
import './games/bobail/bobail';
import './games/chess/chess';
import './games/draughts/draughts';

// Imports other than '*' seems not to work.
import * as games from './games';
import * as sbg from './simple-board-game';

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