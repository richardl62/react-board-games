import { Ctx } from "boardgame.io";
import React from "react";
import { AppGame } from "../../app-game-support";
import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import Board from "./board-wrapper";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";


function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingServerData(ctx, config),
  
        moves: bgioMoves,
  
        board: (props: WrappedGameProps) => <Board
            appBoardProps={props} config={config}
        />
    };
}

export const appGames = configs.map(makeAppGame);

