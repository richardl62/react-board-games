import bobail from './bobail/bobail';
import chess from './chess/chess';
import draughts from './draughts/draughts';
import { GameProps } from '../simple-board-game';

const games : {[key: string]: GameProps } =  // Setting the type is defensive
    {...bobail, ...chess, ...draughts };

function gameDefinitions() {
    console.log("gameDefinitions called: games=", games);
    return games;
}

const radmonObject = {
    a: 1,
    b: "twp",
};

export default games;
export {gameDefinitions, radmonObject};  // TEMPORARY - used in server

