import { Ctx } from "boardgame.io";
import React from "react";
import { AppBoardProps } from "shared/app-board-props";
import { AppGame } from "shared/types";
import { Board } from "./board";
import { bgioMoves } from "./game-control";
import { GameData, startingGameData } from "./game-data";
import { ScrabbleConfig } from "./scrabble-config";

export function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
        ...config,
  
        setup: (ctx: Ctx) => startingGameData(ctx, config),
  
        moves: bgioMoves,
  
        board: (props: AppBoardProps<GameData>) => <Board
            appBoardProps={props} config={config}
        />
    };
}