import { Ctx } from "boardgame.io";
import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { AppGameNoBoard } from "../../app-game-support/app-game";

function makeAppGame(config: ScrabbleConfig) : AppGameNoBoard
{
    return {
        ...config,
  
        setup: ({ctx}: {ctx: Ctx}) => startingServerData({ctx}, config),
  
        moves: bgioMoves,

    };
}

export const appGamesNoBoard = configs.map(makeAppGame);

