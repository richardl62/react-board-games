import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { GameControl } from "../../app-game-support/app-game";
import { SetupArg0 } from "@/game-controlX/types/game";
import { SetupOptions } from "./options";

function makeAppGame(config: ScrabbleConfig) : GameControl
{
    return {
        ...config,
  
        setup: (arg0: SetupArg0, options: unknown) => 
            startingServerData(arg0, options as SetupOptions, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoard = configs.map(makeAppGame);

