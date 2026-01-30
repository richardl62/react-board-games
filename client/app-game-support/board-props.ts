import { WaitingForServer } from "@/app/match-play/game-board-wrapper";
import { ConnectionStatus } from "@/app/match-play/online/use-server-connection";
import { Ctx } from "@shared/game-control/ctx";
import { EventsAPI } from "@shared/game-control/events";
import { PlayerID } from "@shared/game-control/playerid";
import { PublicPlayerMetadata } from "@shared/lobby/types";

export interface MatchStatus {
    connectionStatus: ConnectionStatus;
    
    playerData: PublicPlayerMetadata[];
    
    waitingForServer: WaitingForServer;
    
    errorInLastAction: string | null;
}

export type UntypedMoves = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: (...args: any[]) => void;
};

// The props used by the board in individual games.
export interface BoardProps<
    TypeG=unknown, 
    Moves extends UntypedMoves=UntypedMoves
> {
    G: TypeG;

    ctx: Ctx;

    playerID: PlayerID;

    moves: Moves;

    events: EventsAPI;

    matchStatus: MatchStatus;

    // Start of convenience properties.
    getPlayerName: (pid: string) => string;

    allJoined: boolean;
}
