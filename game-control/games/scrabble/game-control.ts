import { ScrabbleConfig } from "./config/scrabble-config";
import { bgioMoves } from "./moves/moves";
import { startingServerData } from "./server-data";
import { GameControl } from "../../game-control";
import { SetupArg0 } from "../../game-control";
import { simple, standard } from "./config/scrabble-config";
import { SetupOptions } from "./server-data";

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

