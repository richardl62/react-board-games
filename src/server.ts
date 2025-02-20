// Adapted from https://boardgame.io/documentation/#/deployment?id=heroku

import path from "path";
import serve from "koa-static";
import { gamesNoBoard } from "./games/app-games-no-board";
import { Origins, Server } from "./boardgame-lib/server";

console.log("Starting games server");

const server = Server({ 
    games: gamesNoBoard,
    origins: [
        // Allow your game site to connect.
        "https://richards-board-games.herokuapp.com",
        // Allow localhost to connect, except when NODE_ENV is 'production'.
        Origins.LOCALHOST_IN_DEVELOPMENT
    ],
});
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, "../build");
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT as never, () => {
    server.app.use(
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, { path: "index.html" }),
            next
        )
    );
});