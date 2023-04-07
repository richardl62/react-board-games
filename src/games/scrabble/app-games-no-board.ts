import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { AppGameNoBoard } from "../../app-game-support/app-game";
import { SetupArg0 } from "../../app-game-support/bgio-types";

function makeAppGame(config: ScrabbleConfig) : AppGameNoBoard
{
    return {
        ...config,
  
        setup: (arg0: SetupArg0) => startingServerData(arg0, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoard = configs.map(makeAppGame);

