import { BoardProps } from "boardgame.io/react";

interface AppGame<G = any> {
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name: string;

  setup: () => G;
  moves: any; // KLUDGE
  renderGame: (props: BoardProps<G>) => JSX.Element;

  minPlayers: number,
  maxPlayers: number,

}

export type { AppGame, BoardProps };

