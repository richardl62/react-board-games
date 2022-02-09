import { Game } from "boardgame.io";
import { WrappedGameProps } from "../bgio";

export type MatchData = WrappedGameProps["matchData"];

export interface Player {
  id: string;
  credentials: string;
}

export interface MatchID {
  mid: string
} 

// The string values are uses as section headers when displaying the list of
// games.
export enum GameCategory {
  standard = "Standard",
  development = "Under Development",
  test = "Test/Debug",
}

// TO DO: Try to avoid this use of 'any'.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppGame<G = any> extends Game<G> { 
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;
  category: GameCategory;

  // Space-free name suitable for passing to bgio.
  name: string;

  minPlayers: number,
  maxPlayers: number,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  board: (props: WrappedGameProps<G, any>) => JSX.Element;
}