import { Game } from "boardgame.io";
import { RequiredServerData } from "./required-server-data";
import { OptionSpecifications } from "../app/option-specification/types";
import { WrappedGameProps } from "./wrapped-game-props";
import { SetupArg0 } from "./bgio-types";

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

export interface AppGameNoBoard extends Game { 
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Used for
  // display purposes.
  displayName: string;
  category: GameCategory;

  // Space-free name suitable for passing to bgio.
  name: string;

  moves: Required<Game>["moves"];

  options?: OptionSpecifications;

  // KLUDGE?: The setup function is expected to return a type derived from
  // RequiredState. Specifying the return type as RequiredStates enforces this.
  setup: (arg0: SetupArg0, setupData?: unknown) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,
}

// Not used in the server. (Seperating the board avoids some build problems.)
export interface AppGame extends AppGameNoBoard { 
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
