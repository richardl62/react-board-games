import { Ctx } from "boardgame.io";
import React from "react";
import { BgioGameProps } from "../../bgio";
import { AppGame } from "../../shared/types";
import { startingGeneralGameState, bgioMoves } from "./actions";
import { BoardWrapper } from "./board-wrapper";
import { configs, ScrabbleConfig } from "./config";


function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGeneralGameState(ctx.numPlayers, config),
  
        moves: bgioMoves,
  
        board: (props: BgioGameProps) => <BoardWrapper
            appBoardProps={props} config={config}
        />
    };
}

const games = configs.map(makeAppGame);
export default games;
