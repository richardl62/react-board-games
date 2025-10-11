import { Ctx } from "./ctx.js";
import { EventsAPI } from "./events.js";
import { PlayerID } from "./playerid.js";

export interface MatchDataElem {
    id: number
    
    // Optional to match boardgame.io, but required in some places.
    name?: string;
    isConnected?: boolean;
}

type Moves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: (...args: any[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BoardProps<TypeG=any> {
    playerID: PlayerID | null;
    credentials?: string;

    matchID: string;

    // Optional to match boardgame.io, but required in some places.
    matchData?: Array<MatchDataElem>; 
    ctx: Ctx;

    moves: Moves;
    events: EventsAPI;

    isConnected: boolean;
    G: TypeG;
}