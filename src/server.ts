// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku
import { Server } from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import { BasicGame } from './shared/types';
import { bobailInput } from './games/bobail/bobail-input';
import { chessInput } from './games/chess/chess-input';
import { draughtsInput } from './games/draughts/draughts-input';
import { makeBasicGridGame } from './layout/grid-based-board/make-basic-grid-game';
import { plusminusInput } from './games/plus-minus/plus-minus-input';

export const games : Array<BasicGame> = [
    ...bobailInput.map(makeBasicGridGame),
    ...chessInput.map(makeBasicGridGame),
    ...draughtsInput.map(makeBasicGridGame),
    ...plusminusInput, 
];

console.log("Games: ", games.map(g => g.name));

const server = Server({ games: games });
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