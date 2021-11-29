import { Game } from "boardgame.io";
import { BgioGameProps } from "../bgio";

export type MatchData = BgioGameProps["matchData"];

export interface Player {
  id: string;
  credentials: string;
}

export interface MatchID {
  mid: string
} 

// TO DO: Try to avoid this use of 'any'.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppGame<G = any> extends Game<G> { 
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name: string;

  minPlayers: number,
  maxPlayers: number,
  board: (props: BgioGameProps<G>) => JSX.Element;
}