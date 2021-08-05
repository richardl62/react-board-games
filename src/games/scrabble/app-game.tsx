import { Ctx } from "boardgame.io";
import { AppGame, BoardProps } from "../../shared/types";
import { bgioMoves } from "./bgio-moves";
import { GameData, startingGameData } from "./game-data";
import { ScrabbleBoard } from "./scrabble";
import { ScrabbleConfig } from "./scrabble-config";

type ReducedAppGame = Omit<AppGame, 'setup' | 'moves' | 'board'>;


export function makeAppGame(param: ReducedAppGame, config: ScrabbleConfig) : AppGame
{
    return {
    ...param,
  
    setup: (ctx: Ctx) => startingGameData(ctx, config),
  
    moves: bgioMoves,
  
    board: (props: BoardProps<GameData>) => <ScrabbleBoard
        {...props} config={config}
      />
    }
    
  };