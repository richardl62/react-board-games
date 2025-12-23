import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { PlayerID } from "@shared/game-control/playerid";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { ReadyState } from "react-use-websocket";

export type ConnectionStatus = "offline" | {
    readyState: ReadyState;
    waitingForServer: boolean;
};

type Moves = {
    [x: string]: (...args: unknown[]) => void;
}

export interface BoardProps<TypeG=unknown> {
    playerID: PlayerID | null; // Is the null option needed?

    connectionStatus: ConnectionStatus;

    // This is misnamed in that it given info about players rather than
    // the match as whole.
    matchData: Array<PublicPlayerMetadata>;
    
    ctx: Ctx;

    moves: Moves;

    events: EventsAPI;

    G: TypeG;

    moveError: string | null;
}