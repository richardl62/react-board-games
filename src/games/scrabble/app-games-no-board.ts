import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { SetupArg0 } from "@game-control/types/game";
import { SetupOptions } from "./options";

function makeAppGame(config: ScrabbleConfig) : AppGameNoBoard
{
    return {
        ...config,
  
        setup: (arg0: SetupArg0, options: unknown) => 
            startingServerData(arg0, options as SetupOptions, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoard = configs.map(makeAppGame);

