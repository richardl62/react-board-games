// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku
import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';


const bobail = require('./src/game-definition/bobail').default;
const chess = require('./src/game-definition/chess').default;
const draughts = require('./src/game-definition/draughts').default;
const makeBgioGame = require('./src/shared-utilities').makeBgioGame;
const gameDefinitions = [...bobail, ...chess, ...draughts];
const bgioGames = gameDefinitions.map(makeBgioGame);

// @ts-ignore
console.log("Games: ", bgioGames.map(g => g.name));


// @ts-ignore
const server = Server({ games: bgioGames });
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT as any, () => {
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  );
});