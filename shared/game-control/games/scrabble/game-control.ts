import { ScrabbleConfig } from "./config/scrabble-config.js";
import { bgioMoves } from "./moves/moves.js";
import { startingServerData } from "./server-data.js";
import { GameControl } from "../../game-control.js";
import { SetupArg0 } from "../../game-control.js";
import { simple, standard } from "./config/scrabble-config.js";
import { SetupOptions } from "./server-data.js";

function makeAppGame(config: ScrabbleConfig) : GameControl
{
    return {
        ...config,
  
        setup: (arg0: SetupArg0, options: unknown) => 
            startingServerData(arg0, options as SetupOptions, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoardSimple = makeAppGame(simple);
export const appGamesNoBoardStandard = makeAppGame(standard);

export const appGamesNoBoard = [appGamesNoBoardSimple, appGamesNoBoardStandard];

