import { BgioGame as Chess } from './chess';
import { BgioGame as Draughts } from './draughts';
import{ BgioGame as Bobail }from './bobail';
const { Server } = require('boardgame.io/server');

const server = Server({ games: [Chess, Draughts, Bobail] });

server.run(8000);