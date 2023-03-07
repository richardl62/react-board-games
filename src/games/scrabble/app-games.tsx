import { Ctx } from "boardgame.io";
import React from "react";
import { AppGame } from "../../app-game-support";
import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./server-side";
import { WrappedGameProps } from "../../app-game-support/wrapped-game-props";
import { standardBoard } from "../../app-game-support/standard-board";

const LazyBoard = React.lazy(() => import("./board/board-wrapper"));

function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingServerData(ctx, config),
  
        moves: bgioMoves,
  
        board: (props: WrappedGameProps) => standardBoard(LazyBoard, props, config),
    };
}

export const appGames = configs.map(makeAppGame);

