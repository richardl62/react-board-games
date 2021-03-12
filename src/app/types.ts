export interface Game {
  // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
  // display purposes.
  displayName: string;

  // Space-free name suitable for passing to bgio.
  name:string;

  setup: () => any;
  moves: any; // KLUDGE
  renderGame: (arg0: any) => JSX.Element;
}

export interface Servers {
  game: string;
  lobby: string;
}

export type GameStatus = 'open' | 'started' | 'finished';

export interface OnlineGame {
    name: string; // Name of the game, e.g. 'chessaside'.
    id: string;   // ID of an individual game.
    address: string; // Link address from the individual game.
    status: GameStatus;
}

// Exports are done inline