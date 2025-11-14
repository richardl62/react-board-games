import { Ctx } from "./ctx.js";
import { EventsAPI } from "./events.js";
import { PlayerID } from "./playerid.js";

export interface MatchDataElem {
    id: string;
    
    // Undefined means the player has not joined yet.
    name?: string;

    isConnected: boolean;
}

type Moves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: (...args: any[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BoardProps<TypeG=any> {
    playerID: PlayerID | null; // Is the null option needed?

    // credentials and matchID seem to be used just to check if the match is
    // offline.  Can they be merged or prehaps removed?
    credentials?: string;
    matchID: string;

    // This is misnamed in that it given info about players rather than
    // the match as whole.
    matchData: Array<MatchDataElem>; 
    
    ctx: Ctx;

    moves: Moves;

    events: EventsAPI;

    // Use (I think) to indicate a temporary lost of connection to the sever.
    isConnected: boolean;

    G: TypeG;
}