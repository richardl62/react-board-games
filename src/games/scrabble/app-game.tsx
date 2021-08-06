import React from "react";
import { Ctx } from "boardgame.io";
import { AppGame, BoardProps } from "../../shared/types";
import { bgioMoves } from "./bgio-moves";
import { GameData, startingGameData } from "./game-data";
import { ScrabbleBoard } from "./scrabble";
import { ScrabbleConfig } from "./scrabble-config";

export function makeAppGame(config: ScrabbleConfig) : AppGame
{
    return {
    ...config,
  
    setup: (ctx: Ctx) => startingGameData(ctx, config),
  
    moves: bgioMoves,
  
    board: (props: BoardProps<GameData>) => <ScrabbleBoard
        {...props} config={config}
      />
    }
    
  };