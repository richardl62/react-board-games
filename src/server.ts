import 'ignore-styles'
import gameDefinitions from './games';
import { bgioGame } from './simple-board-game';

import { Server } from 'boardgame.io/server';

const games = [];
for(const name in gameDefinitions) {
    games.push(bgioGame(gameDefinitions[name]));
}
const server = Server({ games: games });

server.run(8000);