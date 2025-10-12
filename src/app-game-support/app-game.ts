import { Game } from "@/game-controlX/types/game";
import { RequiredServerData } from "./required-server-data";
import { WrappedGameProps } from "./wrapped-game-props";
import { SetupArg0 } from "@/game-controlX/types/game";
import { JSX } from "react";
import { OptionSpecifications } from "@/app/option-specification/types";

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

// GameControl is used by the server and the app (c.f. AppGame which is used
// just by the app).
export interface GameControl extends Game { 
  // Space-free name used to identify the game.
  name: string

  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Used for
  // display purposes. 
  // KLUDGE: Could be in AppGame.
  displayName: string;

  //KLUDGE: Could be in AppGame.
  category: GameCategory;

  moves: Required<Game>["moves"];

  // KLUDGE?: The setup function is expected to return a type derived from
  // RequiredState. Specifying the return type as RequiredStates enforces this.
  setup: (arg0: SetupArg0, setupData?: unknown) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,
}

// Not used in the server.
export interface AppGame extends GameControl { 
  options?: OptionSpecifications;
  board: (props: WrappedGameProps) => JSX.Element;
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
