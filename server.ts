// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku
import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';

const games = require('./src/games').default;
const makeBgioGame = require('./src/bgio-tools/make-game').default;
const bgioGames = games.map(makeBgioGame);

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