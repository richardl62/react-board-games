import { OptionSpecifications } from "@/option-specification/types";
import { JSX } from "react";
import { BoardProps } from "./board-props";
import { GameControl } from "@game-control/game-control";

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

// Not used in the server.
export interface AppGame extends GameControl { 
  // The name of the game used for display purposes (c.f. name in GameControl).
  // KLUDGE: Could be in AppGame.
  displayName: string;

  category: GameCategory;

  options?: OptionSpecifications;
  board: (props: BoardProps) => JSX.Element;
}

export function defaultNumPlayers(game: AppGame): number {
    let num = 2; //Arbitrary

    if (num < game.minPlayers) {
        num = game.minPlayers;
    }

    if (num > game.maxPlayers) {
        num = game.maxPlayers;
    }
    
    return num;
}
