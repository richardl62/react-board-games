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

export interface AppGame<G = any> {
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name: string;

  setup: () => G;
  moves: any; // KLUDGE
  board: (props: BoardProps<G>) => JSX.Element;

  minPlayers: number,
  maxPlayers: number,
}