// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku
import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { games } from './games/basic-games';

console.log("Games: ", games.map(g => g.name));

const server = Server({ games: games });
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT as any, () => {
  server.app.use(
    async (ctx, next) => await serve(frontEndAppBuildPath)(
      Object.assign(ctx, { path: 'index.html' }),
      next
    )
  );
});