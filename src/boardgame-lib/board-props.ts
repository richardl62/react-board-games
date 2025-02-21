import { Ctx } from "./ctx";
import { EventsAPI } from "./events";
import { PlayerID } from "./playerid";

export interface MatchDataElem {
    id: number
    
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

    matchData?: Array<MatchDataElem>;
    ctx: Ctx;

    moves: Moves;
    events: EventsAPI;

    isConnected: boolean;
    G: TypeG;
}