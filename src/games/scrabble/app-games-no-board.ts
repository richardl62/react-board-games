import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { SetupArg0 } from "../../app-game-support/bgio-types";
import { SetupOptions, setupOptions } from "./options";

function makeAppGame(config: ScrabbleConfig) : AppGameNoBoard
{
    return {
        ...config,

        options: setupOptions,
  
        setup: (arg0: SetupArg0, options: unknown) => 
            startingServerData(arg0, options as SetupOptions, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoard = configs.map(makeAppGame);

