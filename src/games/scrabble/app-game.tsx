import { Ctx } from "boardgame.io";
import { AppGame } from "../../shared/types";
import { bgioMoves } from "./bgio-moves";
import { startingGameData } from "./game-data";
import { ScrabbleBoard } from "./scrabble";
import { ScrabbleConfig } from "./scrabble-config";

type ReducedAppGame = Omit<AppGame, 'setup' | 'moves' | 'board'>;


export function makeAppGame(param: ReducedAppGame, config: ScrabbleConfig) : AppGame
{
    return {
    ...param,
  
    setup: (ctx: Ctx) => startingGameData(ctx, config),
  
    moves: bgioMoves,
  
    board: ScrabbleBoard,
    }
    
  };