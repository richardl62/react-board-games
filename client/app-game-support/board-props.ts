import { ConnectionStatus } from "@/app/match-play/online/use-server-connection";
import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { PlayerID } from "@shared/game-control/playerid";
import { PublicPlayerMetadata } from "@shared/lobby/types";

export type UntypedMoves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: (...args: any[]) => void;
}

export interface BoardProps<TypeG=unknown, Moves extends UntypedMoves = UntypedMoves> {
    playerID: PlayerID;

    connectionStatus: ConnectionStatus;

    // This is misnamed in that it given info about players rather than
    // the match as whole.
    matchData: Array<PublicPlayerMetadata>;
    
    ctx: Ctx;

    moves: Moves;

    events: EventsAPI;

    G: TypeG;

    errorInLastAction: string | null;
}