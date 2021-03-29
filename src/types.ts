export interface AppFriendlyGame {
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes.
    displayName: string;
  
    // Space-free name suitable for passing to bgio.
    name:string;
  
    setup: () => any;
    moves: any; // KLUDGE
    renderGame: (arg0: any) => JSX.Element;
  }