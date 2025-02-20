//*** START OF OLD CODE */
// This code gives a work-around for an apparent bug in a Bgio type defition.

//import { BoardProps as BoardProps_} from "boardgame.io/react";
// type MatchDataElem_ = Required<BoardProps_>["matchData"][0]; 

// // The Bgio supplied version of MatchDataElem does not have
// // isConnected as an optional elemeent.
// export interface MatchDataElem extends MatchDataElem_{
//     isConnected?: boolean;
// } 

// export interface BoardProps<G=unknown> extends BoardProps_<G> {
//     matchData?: Array<MatchDataElem>;
// }
//*** END OF OLD CODE */

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