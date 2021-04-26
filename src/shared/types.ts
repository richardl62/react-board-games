import { BoardProps } from "./bgio-types";
export type { BoardProps }

export type MatchData = BoardProps["matchData"];

export interface Player {
  id: string;
  credentials: string;
}

export interface MatchID {
  mid: string
} 

export interface BasicGame<G = any> {
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name: string;

  setup: () => G;
  moves: any; // KLUDGE

  minPlayers: number,
  maxPlayers: number,
}

export interface AppGame<G = any> extends BasicGame<G> {
  board: (props: BoardProps<G>) => JSX.Element;
}