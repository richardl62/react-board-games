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

export interface Player {
  id: string;
  credentials: string;
}

export interface JoinedMatch {
  game: Game;
  matchID: string;
  playerID: string;
  playerCredentials: string;
}

export const numPlayers = 1;
// Exports are done inline