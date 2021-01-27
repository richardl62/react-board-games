// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku
import { Server } from 'boardgame.io/server';
const gameDefinitions = require('./src/game-definition').default;
const makeBgioGame = require('./src/bgio/make-game').default;
const bgioGames = gameDefinitions.map(makeBgioGame);

// @ts-ignore
console.log("Games: ", bgioGames.map(g => g.name));

// @ts-ignore
const server = Server({ games: bgioGames });

server.run(8000);