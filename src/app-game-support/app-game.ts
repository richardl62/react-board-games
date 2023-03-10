import { Ctx, Game } from "boardgame.io";
import { RequiredServerData } from "./required-state";
import { WrappedGameProps } from "./wrapped-game-props";

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

export interface AppGame extends Game { 
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Used for
  // display purposes.
  displayName: string;
  category: GameCategory;

  // Space-free name suitable for passing to bgio.
  name: string;

  moves: Required<Game>["moves"];

  // KLUDGE?: The setup function is expected to return a type derived from
  // RequiredState. Specifying the return type as RequiredStates enforces this.
  setup: (ctx: Ctx) => RequiredServerData;

  minPlayers: number,
  maxPlayers: number,

  board: (props: WrappedGameProps) => JSX.Element;
}