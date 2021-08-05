import { simple as simpleConfig, standard as standardConfig } from './scrabble-config'
import { makeAppGame } from "./app-game";

const games = [ 
    makeAppGame(
        {
           name: 'scrabble',
           displayName: 'Scrabble',
           minPlayers: 1,
           maxPlayers: 4, 
        },
        standardConfig,
    ), 
    makeAppGame(
        {
           name: 'scrabble-simple',
           displayName: 'Simple Scrabble (for testing)',
           minPlayers: 1,
           maxPlayers: 4, 
        },
        simpleConfig,
    ), 
];
export default games;