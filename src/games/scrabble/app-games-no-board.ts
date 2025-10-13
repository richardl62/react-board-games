import { ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { GameControl } from "../../app-game-support/app-game";
import { SetupArg0 } from "@/game-controlX/game";
import { SetupOptions } from "./options";
import { simple, standard } from "./config/scrabble-config";

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

