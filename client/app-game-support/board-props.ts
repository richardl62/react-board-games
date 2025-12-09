import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { PlayerID } from "@shared/game-control/playerid";
import { ReadyState } from "react-use-websocket";

export interface OnlineConnectionStatus {
    readyState: ReadyState,

    // A non-null error indicates a high-level problem with the connection.
    // Problems that can caught and handled on the server, e.g. an out-of-turn
    // move attempt, are reported via WsServerResponse.
    error: string | null,
}

export type ConnectionStatus = "offline" | OnlineConnectionStatus;

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

    connectionStatus: ConnectionStatus;

    // This is misnamed in that it given info about players rather than
    // the match as whole.
    matchData: Array<MatchDataElem>; 
    
    ctx: Ctx;

    moves: Moves;

    events: EventsAPI;

    G: TypeG;
}