import { Game } from "boardgame.io";
import { BoardProps } from "./board-props";
export type { BoardProps };

export type MatchData = BoardProps["matchData"];

export interface Player {
  id: string;
  credentials: string;
}

export interface MatchID {
  mid: string
} 

export interface AppGame<G = any> extends Game<G> {
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name: string;

  minPlayers: number,
  maxPlayers: number,
  board: (props: BoardProps<G>) => JSX.Element;
}