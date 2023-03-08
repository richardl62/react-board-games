import { Ctx, Game } from "boardgame.io";
import { RequiredState } from "./wrap-move-functions";
import { WrappedGameProps } from "./wrapped-game-props";

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

export interface AppGame<G extends RequiredState = RequiredState> extends Game<G> { 
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Used for
  // display purposes.
  displayName: string;
  category: GameCategory;

  // Space-free name suitable for passing to bgio.
  name: string;

  moves: Required<Game>["moves"];
  setup: (ctx: Ctx) => G;

  minPlayers: number,
  maxPlayers: number,

  board: (props: WrappedGameProps<G, unknown>) => JSX.Element;
}