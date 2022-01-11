import { Ctx } from "boardgame.io";
import React from "react";
import { WrappedGameProps } from "../../bgio";
import { AppGame } from "../../shared/types";
import { startingGeneralGameState, bgioMoves } from "./actions";
import { configs, ScrabbleConfig } from "./config";
import { LazyBoardWrapper } from "./lazy-board-wrapper";


function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGeneralGameState(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: WrappedGameProps) => <LazyBoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;
