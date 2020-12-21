import bobail from './bobail/bobail';
import chess from './chess/chess';
import draughts from './draughts/draughts';
import { GameProps } from '../simple-board-game';

const games : {[key: string]: GameProps } =  // Setting the type is defensive
    {...bobail, ...chess, ...draughts };

export default games;

