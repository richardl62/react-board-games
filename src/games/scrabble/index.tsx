import { Ctx } from "boardgame.io";
import React from "react";
import { AppGame, WrappedGameProps } from "../../app-game-support";
import { configs, ScrabbleConfig } from "./config";
import { bgioMoves, startingServerData } from "./global-actions";
import { LazyBoardWrapper } from "./lazy-board-wrapper";


function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingServerData(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: WrappedGameProps) => <LazyBoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;
