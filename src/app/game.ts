//import games  from '../games'
//type Game = (typeof games)[number]; // KLUDGE

interface Game {
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes.
    displayName: string;

    // Space-free name suitable for passing to bgio.
    name:string;

    setup: any; // KLUDGE
    moves: any; // KLUDGE
    renderGame: (arg0: any) => JSX.Element;
}
export type {Game}