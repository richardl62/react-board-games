import { BgioGame as Chess } from './games/chess';
import { BgioGame as Draughts } from './games/draughts';
import{ BgioGame as Bobail }from './games/bobail';
const { Server } = require('boardgame.io/server');

const server = Server({ games: [Chess, Draughts, Bobail] });

server.run(8000);